import type { RichTextNode } from "./shopify";

function renderNode(node: RichTextNode, index: number): React.ReactNode {
  if (node.type === "text") {
    return node.value ?? "";
  }

  const children = node.children?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case "root":
      return <div key={index}>{children}</div>;

    case "heading":
      switch (node.level) {
        case 4:
          return (
            <h4 key={index} className="font-semibold text-black mb-2">
              {children}
            </h4>
          );
        case 5:
          return (
            <h5 key={index} className="font-medium text-black mb-1">
              {children}
            </h5>
          );
        default:
          return (
            <h4 key={index} className="font-semibold text-black mb-2">
              {children}
            </h4>
          );
      }

    case "paragraph":
      return (
        <p key={index} className="mb-1">
          {children}
        </p>
      );

    case "list":
      if (node.listType === "ordered") {
        return (
          <ol key={index} className="space-y-1 list-decimal list-inside">
            {children}
          </ol>
        );
      }
      return (
        <ul key={index} className="space-y-1 list-disc list-inside">
          {children}
        </ul>
      );

    case "list-item":
      return <li key={index}>{children}</li>;

    case "link":
      return (
        <a
          key={index}
          href={node.value ?? "#"}
          className="underline text-blue-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );

    default:
      return <span key={index}>{children}</span>;
  }
}

export function RichTextContent({ node }: { node: RichTextNode | null }) {
  if (!node) return null;
  return (
    <div className="pt-2 pb-4 text-[#6c6a6a] text-sm md:text-base font-light leading-relaxed space-y-4">
      {node.children?.map((child, i) => renderNode(child, i))}
    </div>
  );
}
