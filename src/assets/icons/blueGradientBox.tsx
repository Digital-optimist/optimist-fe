import { motion } from "framer-motion";
//@ts-ignore
const BlueGradientBox = ({ progress = 0, ...props }: { progress?: number }) => {
    const s1_8 = 1.1 - (0.3 * progress); // 100% -> 70%
    const s2_7 = 1.1 - (0.5 * progress); // 90% -> 40%
    const s3_6 = 1.1 - (0.6 * progress); // 80% -> 20%
    const s4_5 = 1.1 - (0.6 * progress); // 70% -> 10%

    return (
        <svg
            width={1360}
            height={622}
            viewBox="0 0 1360 622"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_1084_2444)">
                <rect width={1360} height={622} fill="black" />
                <motion.g animate={{ scaleY: s4_5 }} style={{ originY: 1, transformBox: 'fill-box' as const }}>
                    <mask id="path-1-inside-1_1084_2444" fill="white">
                        <path d="M680 0H850V622H680V0Z" />
                    </mask>
                    <path d="M680 0H850V622H680V0Z" fill="url(#paint0_linear_1084_2444)" />
                    <path
                        d="M850 0H849V622H850H851V0H850Z"
                        fill="white"
                        fillOpacity={0.2}
                        mask="url(#path-1-inside-1_1084_2444)"
                    />
                </motion.g>
                <motion.g filter="url(#filter0_d_1084_2444)" animate={{ scaleY: s3_6 }} style={{ originY: 1, transformBox: 'fill-box' as const }}>
                    <mask id="path-3-inside-2_1084_2444" fill="white">
                        <path d="M1020 0H850V622H1020V0Z" />
                    </mask>
                    <path
                        d="M1020 0H850V622H1020V0Z"
                        fill="url(#paint1_linear_1084_2444)"
                        shapeRendering="crispEdges"
                    />
                    <path
                        d="M850 0H851V622H850H849V0H850Z"
                        fill="white"
                        fillOpacity={0.2}
                        mask="url(#path-3-inside-2_1084_2444)"
                    />
                </motion.g>
                <motion.g filter="url(#filter1_d_1084_2444)" animate={{ scaleY: s2_7 }} style={{ originY: 1, transformBox: 'fill-box' as const }}>
                    <mask id="path-5-inside-3_1084_2444" fill="white">
                        <path d="M1190 0H1020V622H1190V0Z" />
                    </mask>
                    <path
                        d="M1190 0H1020V622H1190V0Z"
                        fill="url(#paint2_linear_1084_2444)"
                        shapeRendering="crispEdges"
                    />
                    <path
                        d="M1020 0H1021V622H1020H1019V0H1020Z"
                        fill="white"
                        fillOpacity={0.2}
                        mask="url(#path-5-inside-3_1084_2444)"
                    />
                </motion.g>
                <motion.g filter="url(#filter2_d_1084_2444)" animate={{ scaleY: s1_8 }} style={{ originY: 1, transformBox: 'fill-box' as const }}>
                    <mask id="path-7-inside-4_1084_2444" fill="white">
                        <path d="M1360 0H1190V622H1360V0Z" />
                    </mask>
                    <path
                        d="M1360 0H1190V622H1360V0Z"
                        fill="url(#paint3_linear_1084_2444)"
                        shapeRendering="crispEdges"
                    />
                    <path
                        d="M1190 0H1191V622H1190H1189V0H1190Z"
                        fill="white"
                        fillOpacity={0.2}
                        mask="url(#path-7-inside-4_1084_2444)"
                    />
                </motion.g>
                <motion.g animate={{ scaleY: s4_5 }} style={{ originY: 1, transformBox: 'fill-box' as const }}>
                    <mask id="path-9-inside-5_1084_2444" fill="white">
                        <path d="M510 0H680V622H510V0Z" />
                    </mask>
                    <path d="M510 0H680V622H510V0Z" fill="url(#paint4_linear_1084_2444)" />
                    <path
                        d="M680 0H679V622H680H681V0H680Z"
                        fill="white"
                        fillOpacity={0.2}
                        mask="url(#path-9-inside-5_1084_2444)"
                    />
                </motion.g>
                <motion.g filter="url(#filter3_d_1084_2444)" animate={{ scaleY: s3_6 }} style={{ originY: 1, transformBox: 'fill-box' as const }}>
                    <mask id="path-11-inside-6_1084_2444" fill="white">
                        <path d="M340 0H510V622H340V0Z" />
                    </mask>
                    <path
                        d="M340 0H510V622H340V0Z"
                        fill="url(#paint5_linear_1084_2444)"
                        shapeRendering="crispEdges"
                    />
                    <path
                        d="M510 0H509V622H510H511V0H510Z"
                        fill="white"
                        fillOpacity={0.2}
                        mask="url(#path-11-inside-6_1084_2444)"
                    />
                </motion.g>
                <motion.g filter="url(#filter4_d_1084_2444)" animate={{ scaleY: s2_7 }} style={{ originY: 1, transformBox: 'fill-box' as const }}>
                    <mask id="path-13-inside-7_1084_2444" fill="white">
                        <path d="M170 0H340V622H170V0Z" />
                    </mask>
                    <path
                        d="M170 0H340V622H170V0Z"
                        fill="url(#paint6_linear_1084_2444)"
                        shapeRendering="crispEdges"
                    />
                    <path
                        d="M340 0H339V622H340H341V0H340Z"
                        fill="white"
                        fillOpacity={0.2}
                        mask="url(#path-13-inside-7_1084_2444)"
                    />
                </motion.g>
                <motion.g filter="url(#filter5_d_1084_2444)" animate={{ scaleY: s1_8 }} style={{ originY: 1, transformBox: 'fill-box' as const }}>
                    <mask id="path-15-inside-8_1084_2444" fill="white">
                        <path d="M0 0H170V622H0V0Z" />
                    </mask>
                    <path
                        d="M0 0H170V622H0V0Z"
                        fill="url(#paint7_linear_1084_2444)"
                        shapeRendering="crispEdges"
                    />
                    <path
                        d="M170 0H169V622H170H171V0H170Z"
                        fill="white"
                        fillOpacity={0.2}
                        mask="url(#path-15-inside-8_1084_2444)"
                    />
                </motion.g>
                <g filter="url(#filter6_f_1084_2444)">
                    <path
                        d="M320.921 172.955L-71 -29L1454 -27.1385L1045.23 177.312C816.925 291.5 547.835 289.881 320.921 172.955Z"
                        fill="#0A0A0A"
                    />
                </g>
            </g>
            <defs>
                <filter
                    id="filter0_d_1084_2444"
                    x={815}
                    y={-36}
                    width={250}
                    height={702}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx={5} dy={4} />
                    <feGaussianBlur stdDeviation={20} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_1084_2444"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_1084_2444"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter1_d_1084_2444"
                    x={985}
                    y={-36}
                    width={250}
                    height={702}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx={5} dy={4} />
                    <feGaussianBlur stdDeviation={20} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_1084_2444"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_1084_2444"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter2_d_1084_2444"
                    x={1155}
                    y={-36}
                    width={250}
                    height={702}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx={5} dy={4} />
                    <feGaussianBlur stdDeviation={20} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_1084_2444"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_1084_2444"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter3_d_1084_2444"
                    x={305}
                    y={-36}
                    width={250}
                    height={702}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx={5} dy={4} />
                    <feGaussianBlur stdDeviation={20} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_1084_2444"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_1084_2444"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter4_d_1084_2444"
                    x={135}
                    y={-36}
                    width={250}
                    height={702}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx={5} dy={4} />
                    <feGaussianBlur stdDeviation={20} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_1084_2444"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_1084_2444"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter5_d_1084_2444"
                    x={-35}
                    y={-36}
                    width={250}
                    height={702}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx={5} dy={4} />
                    <feGaussianBlur stdDeviation={20} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_1084_2444"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_1084_2444"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter6_f_1084_2444"
                    x={-104.5}
                    y={-62.5}
                    width={1592}
                    height={357.816}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation={16.75}
                        result="effect1_foregroundBlur_1084_2444"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_1084_2444"
                    x1={773}
                    y1={252.5}
                    x2={807}
                    y2={593}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={0.0522584} stopColor="#015AFF" stopOpacity={0} />
                    <stop offset={0.202507} stopColor="#2670FB" />
                    <stop offset={1} stopColor="#518AF6" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_1084_2444"
                    x1={919.5}
                    y1={188}
                    x2={1020}
                    y2={622}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#015AFF" stopOpacity={0} />
                    <stop offset={0.159305} stopColor="#1E6BFC" />
                    <stop offset={1} stopColor="#518AF6" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_1084_2444"
                    x1={1020}
                    y1={156.5}
                    x2={1190}
                    y2={622}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#015AFF" stopOpacity={0} />
                    <stop offset={0.0836739} stopColor="#1767FD" />
                    <stop offset={1} stopColor="#518AF6" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_1084_2444"
                    x1={1174}
                    y1={47.5}
                    x2={1360}
                    y2={622}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#015AFF" stopOpacity={0} />
                    <stop offset={0.136867} stopColor="#0A5FFE" />
                    <stop offset={1} stopColor="#518AF6" />
                </linearGradient>
                <linearGradient
                    id="paint4_linear_1084_2444"
                    x1={603}
                    y1={252.5}
                    x2={578.5}
                    y2={622}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={0.0522584} stopColor="#015AFF" stopOpacity={0} />
                    <stop offset={0.197249} stopColor="#2670FB" />
                    <stop offset={1} stopColor="#518AF6" />
                </linearGradient>
                <linearGradient
                    id="paint5_linear_1084_2444"
                    x1={440.5}
                    y1={188}
                    x2={340}
                    y2={622}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#015AFF" stopOpacity={0} />
                    <stop offset={0.159305} stopColor="#1E6BFC" />
                    <stop offset={1} stopColor="#518AF6" />
                </linearGradient>
                <linearGradient
                    id="paint6_linear_1084_2444"
                    x1={340}
                    y1={156.5}
                    x2={170}
                    y2={622}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#015AFF" stopOpacity={0} />
                    <stop offset={0.0836739} stopColor="#1767FD" />
                    <stop offset={1} stopColor="#518AF6" />
                </linearGradient>
                <linearGradient
                    id="paint7_linear_1084_2444"
                    x1={186}
                    y1={47.5}
                    x2={-0.00000672289}
                    y2={622}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#015AFF" stopOpacity={0} />
                    <stop offset={0.136867} stopColor="#0A5FFE" />
                    <stop offset={1} stopColor="#518AF6" />
                </linearGradient>
                <clipPath id="clip0_1084_2444">
                    <rect width={1360} height={622} fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};
export default BlueGradientBox;
