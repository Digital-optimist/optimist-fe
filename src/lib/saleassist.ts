export const SALEASSIST_WIDGET_ID = "b64c75ac-d186-4979-a841-1572d8d9614b";
const SALEASSIST_SCRIPT_SRC = "https://static.saleassist.ai/widgets/widget.js";
const SALEASSIST_SCRIPT_ID = "saleassist-widget-script";

// SaleAssist's widget.js loads socket.io 4.7.2 from https://cdn.socket.io at
// init time and blocks mounting until that dependency resolves. When
// cdn.socket.io is slow/unreachable (it currently hangs on our network), that
// promise never settles, so the widget silently never mounts and clicking
// "Live Demo" appears to do nothing.
//
// The widget's own loader skips fetching a dependency when the matching global
// already exists (`if (window.io) skip`). So we preload socket.io from a
// reliable CDN (jsDelivr — already used by SaleAssist for `marked`) and assign
// window.io BEFORE injecting widget.js. The widget then skips cdn.socket.io
// entirely and mounts immediately. Version pinned to 4.7.2 to match SaleAssist.
const SOCKET_IO_SRC =
  "https://cdn.jsdelivr.net/npm/socket.io-client@4.7.2/dist/socket.io.min.js";
const SOCKET_IO_SCRIPT_ID = "socketio-client-script";

type SaleAssist = {
  mountWidget?: (opts: { id: string }) => void;
};

declare global {
  interface Window {
    saleassist?: SaleAssist;
    io?: unknown;
  }
}

let loadPromise: Promise<void> | null = null;

function injectScript(src: string, id: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load ${src}`)),
        { once: true },
      );
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = src;
    s.onload = () => {
      s.dataset.loaded = "true";
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

function loadScript(): Promise<void> {
  if (window.saleassist?.mountWidget) {
    return Promise.resolve();
  }
  if (loadPromise) {
    return loadPromise;
  }
  loadPromise = (async () => {
    // Preload socket.io first so window.io exists before widget.js initializes
    // and decides whether to fetch the (currently unreachable) cdn.socket.io.
    // If this CDN ever fails too, fall through — the widget will still attempt
    // its own load.
    if (typeof window.io === "undefined") {
      try {
        await injectScript(SOCKET_IO_SRC, SOCKET_IO_SCRIPT_ID);
      } catch {
        // Non-fatal: let the widget try its own socket.io load as a fallback.
      }
    }
    await injectScript(SALEASSIST_SCRIPT_SRC, SALEASSIST_SCRIPT_ID);
  })();
  loadPromise.catch(() => {
    // Reset so a later click can retry from scratch.
    loadPromise = null;
  });
  return loadPromise;
}

// The widget container the bundle renders for our widget ID, and the launcher
// button inside it that opens the call panel.
const WIDGET_ROOT_SELECTOR = `#saleassist-widget-${SALEASSIST_WIDGET_ID}`;
const OPEN_BTN_SELECTOR = ".sa-live-call-widget-btn";
const EXPANDED_SELECTOR = ".sa-live-call-widget-expanded-inner-wrapper";

// Poll the DOM for a selector until it appears or we time out. mountWidget()
// builds the widget asynchronously (its bundle waits on a `marked` download
// before constructing), so the element shows up a beat after we ask for it.
function waitForElement(
  selector: string,
  timeoutMs = 8000,
): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLElement>(selector);
    if (existing) {
      resolve(existing);
      return;
    }
    const start = Date.now();
    const timer = window.setInterval(() => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el || Date.now() - start >= timeoutMs) {
        window.clearInterval(timer);
        resolve(el);
      }
    }, 80);
  });
}

// This widget's launcher is configured "hidden" (the container carries
// `sa-live-call-widget-btn-container-type-hidden`, which is `display:none`),
// because the storefront drives it from its own "Live Demo" buttons. So
// mounting the widget alone shows nothing — the call panel has to be opened
// programmatically by clicking the (hidden) launcher button. This is exactly
// what the widget's own deep-link path does internally:
//   root.querySelector(".sa-live-call-widget-btn").click()
function openMountedWidget(root: HTMLElement): void {
  const expanded = root.querySelector<HTMLElement>(EXPANDED_SELECTOR);
  if (expanded && expanded.offsetParent !== null) {
    // Already open; clicking again is a harmless no-op, but skip the work.
    return;
  }
  root.querySelector<HTMLElement>(OPEN_BTN_SELECTOR)?.click();
}

// Build the widget the first time, then open it.
//
// The widget's own init does: if a `#saleassist-widget-<id>` element already
// exists, click its launcher (open) and return; otherwise build the DOM. That
// is why the old double-mount "worked" — the second mountWidget() found the
// freshly built widget and opened it. But two mountWidget() calls fired back to
// back re-enter the bundle mid-initialization and throw
// "ReferenceError: Cannot access 'Q' before initialization".
//
// So instead of mounting twice, we mount exactly once and then open the widget
// ourselves by clicking the launcher — once the element actually exists. This
// makes the FIRST click open the panel (no second click needed) with no
// re-entrancy / TDZ risk.
async function mountAndOpen(): Promise<void> {
  const alreadyMounted = document.querySelector<HTMLElement>(
    WIDGET_ROOT_SELECTOR,
  );
  if (alreadyMounted) {
    openMountedWidget(alreadyMounted);
    return;
  }
  window.saleassist?.mountWidget?.({ id: SALEASSIST_WIDGET_ID });
  const root = await waitForElement(`${WIDGET_ROOT_SELECTOR} ${OPEN_BTN_SELECTOR}`)
    .then(() => document.querySelector<HTMLElement>(WIDGET_ROOT_SELECTOR));
  if (root) {
    openMountedWidget(root);
  }
}

export async function openSaleAssist(): Promise<void> {
  try {
    await loadScript();
    await mountAndOpen();
  } catch {
    // Swallow load failures; nothing else we can do client-side.
  }
}
