import type { ImageMetadata } from "astro";
import type { HTMLAttributes } from "astro/types";

import { getImage } from "astro:assets";
import { parseUrl, transformUrl } from "unpic";

export interface ImageProps extends Omit<HTMLAttributes<"img">, "src"> {
  alt?: null | string;
  aspectRatio?: null | number | string;
  decoding?: "async" | "auto" | "sync" | null;
  fetchpriority?: "auto" | "high" | "low" | null;
  format?: string;
  height?: null | number | string;
  layout?: Layout;
  loading?: "eager" | "lazy" | null;
  objectPosition?: string;
  sizes?: null | string;

  src?: ImageMetadata | null | string;
  srcset?: null | string;
  style?: string;
  width?: null | number | string;

  widths?: null | number[];
}

export type ImagesOptimizer = (
  image: ImageMetadata | string,
  breakpoints: number[],
  width?: number,
  height?: number,
  format?: string
) => Promise<Array<{ src: string; width: number }>>;

type Layout =
  | "constrained"
  | "contained"
  | "cover"
  | "fixed"
  | "fullWidth"
  | "responsive";

/* ******* */
const config = {
  deviceSizes: [
    640, // older and lower-end phones
    750, // iPhone 6-8
    828, // iPhone XR/11
    960, // older horizontal phones
    1080, // iPhone 6-8 Plus
    1280, // 720p
    1668, // Various iPads
    1920, // 1080p
    2048, // QXGA
    2560, // WQXGA
    3200, // QHD+
    3840, // 4K
    4480, // 4.5K
    5120, // 5K
    6016, // 6K
  ],

  formats: ["image/webp"],

  // FIXME: Use this when image.width is minor than deviceSizes
  imageSizes: [
    16,
    32,
    48,
    64,
    96,
    128,
    256,
    384,
  ],
};

const computeHeight = (width: number, aspectRatio: number) => {
  return Math.floor(width / aspectRatio);
};

const parseAspectRatio = (
  aspectRatio: null | number | string | undefined
): number | undefined => {
  if (typeof aspectRatio === "number") return aspectRatio;

  if (typeof aspectRatio === "string") {
    const match = aspectRatio.match(/(\d+)\s*[/:]\s*(\d+)/);

    if (match) {
      const [, num, den] = match.map(Number);
      if (den && !isNaN(num)) return num / den;
    } else {
      const numericValue = Number.parseFloat(aspectRatio);
      if (!isNaN(numericValue)) return numericValue;
    }
  }

  return undefined;
};

/**
 * Gets the `sizes` attribute for an image, based on the layout and width
 */
export const getSizes = (width?: number, layout?: Layout): string | undefined => {
  if (!width || !layout) {
    return undefined;
  }
  switch (layout) {
    // If screen is wider than the max size, image width is the max size,
    // otherwise it's the width of the screen
    case `constrained`: {
      return `(min-width: ${width}px) ${width}px, 100vw`;
    }

    // Image is always the same width, whatever the size of the screen
    case `fixed`: {
      return `${width}px`;
    }

    // Image is always the width of the screen
    case `fullWidth`: {
      return `100vw`;
    }

    default: {
      return undefined;
    }
  }
};

const pixelate = (value?: number) => (value || value === 0 ? `${value}px` : undefined);

const getStyle = ({
  aspectRatio,
  background,
  height,
  layout,
  objectFit = "cover",
  objectPosition = "center",
  width,
}: {
  aspectRatio?: number;
  background?: string;
  height?: number;
  layout?: string;
  objectFit?: string;
  objectPosition?: string;
  width?: number;
}) => {
  const styleEntries: Array<[prop: string, value: string | undefined]> = [
    ["object-fit", objectFit],
    ["object-position", objectPosition],
  ];

  // If background is a URL, set it to cover the image and not repeat
  if (
    background?.startsWith("https:") ||
    background?.startsWith("http:") ||
    background?.startsWith("data:")
  ) {
    styleEntries.push(
      ["background-image", `url(${background})`],
      ["background-size", "cover"],
      ["background-repeat", "no-repeat"]
    );
  } else {
    styleEntries.push(["background", background]);
  }
  if (layout === "fixed") {
    styleEntries.push(["width", pixelate(width)]);
    styleEntries.push(["height", pixelate(height)], ["object-position", "top left"]);
  }
  if (layout === "constrained") {
    styleEntries.push(["max-width", pixelate(width)]);
    styleEntries.push(
      ["max-height", pixelate(height)],
      ["aspect-ratio", aspectRatio ? `${aspectRatio}` : undefined],
      ["width", "100%"]
    );
  }
  if (layout === "fullWidth") {
    styleEntries.push(
      ["width", "100%"],
      ["aspect-ratio", aspectRatio ? `${aspectRatio}` : undefined]
    );
    styleEntries.push(["height", pixelate(height)]);
  }
  if (layout === "responsive") {
    styleEntries.push(
      ["width", "100%"],
      ["height", "auto"],
      ["aspect-ratio", aspectRatio ? `${aspectRatio}` : undefined]
    );
  }
  if (layout === "contained") {
    styleEntries.push(
      ["max-width", "100%"],
      ["max-height", "100%"],
      ["object-fit", "contain"],
      ["aspect-ratio", aspectRatio ? `${aspectRatio}` : undefined]
    );
  }
  if (layout === "cover") {
    styleEntries.push(["max-width", "100%"], ["max-height", "100%"]);
  }

  const styles = Object.fromEntries(styleEntries.filter(([, value]) => value));

  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
};

const getBreakpoints = ({
  breakpoints,
  layout,
  width,
}: {
  breakpoints?: number[];
  layout: Layout;
  width?: number;
}): number[] => {
  if (
    layout === "fullWidth" ||
    layout === "cover" ||
    layout === "responsive" ||
    layout === "contained"
  ) {
    return breakpoints || config.deviceSizes;
  }
  if (!width) {
    return [];
  }
  const doubleWidth = width * 2;
  if (layout === "fixed") {
    return [width, doubleWidth];
  }
  if (layout === "constrained") {
    return [
      // Always include the image at 1x and 2x the specified width
      width,
      doubleWidth,
      // Filter out any resolutions that are larger than the double-res image
      ...(breakpoints || config.deviceSizes).filter(w => w < doubleWidth),
    ];
  }

  return [];
};

/* ** */
export const astroAssetsOptimizer: ImagesOptimizer = async (
  image,
  breakpoints,
  _width,
  _height,
  format?
) => {
  if (!image) {
    return [];
  }

  return Promise.all(
    breakpoints.map(async (w: number) => {
      const result = await getImage({
        inferSize: true,
        src: image,
        width: w,
        ...(format ? { format: format } : {}),
      });

      return {
        height: result?.attributes?.height,
        src: result?.src,
        width: result?.attributes?.width ?? w,
      };
    })
  );
};

export const isUnpicCompatible = (image: string) => {
  return parseUrl(image) !== undefined;
};

/* ** */
export const unpicOptimizer: ImagesOptimizer = async (
  image,
  breakpoints,
  width,
  height,
  format?
) => {
  if (!image || typeof image !== "string") {
    return [];
  }

  const urlParsed = parseUrl(image);
  if (!urlParsed) {
    return [];
  }

  return Promise.all(
    breakpoints.map(async (w: number) => {
      const _height = width && height ? computeHeight(w, width / height) : height;
      const url =
        transformUrl({
          cdn: urlParsed.cdn,
          height: _height,
          url: image,
          width: w,
          ...(format ? { format: format } : {}),
        }) || image;
      return {
        height: _height,
        src: String(url),
        width: w,
      };
    })
  );
};

/* ** */
export async function getImagesOptimized(
  image: ImageMetadata | string,
  {
    aspectRatio,
    format,
    height,
    layout = "constrained",
    objectPosition,
    sizes,
    src: _,
    style = "",
    width,
    widths,
    ...rest
  }: ImageProps,
  transform: ImagesOptimizer = () => Promise.resolve([])
): Promise<{ attributes: HTMLAttributes<"img">; src: string }> {
  if (typeof image !== "string") {
    width ||= Number(image.width) || undefined;
    height ||=
      typeof width === "number"
        ? computeHeight(width, image.width / image.height)
        : undefined;
  }

  width = (width && Number(width)) || undefined;
  height = (height && Number(height)) || undefined;

  widths ||= config.deviceSizes;
  sizes ||= getSizes(Number(width) || undefined, layout);
  aspectRatio = parseAspectRatio(aspectRatio);

  // Calculate dimensions from aspect ratio
  if (aspectRatio) {
    if (width) {
      if (height) {
        /* empty */
      } else {
        height = width / aspectRatio;
      }
    } else if (height) {
      width = Number(height * aspectRatio);
    } else if (layout !== "fullWidth") {
      // Fullwidth images have 100% width, so aspectRatio is applicable
      console.error("When aspectRatio is set, either width or height must also be set");
      console.error("Image", image);
    }
  } else if (width && height) {
    aspectRatio = width / height;
  } else if (layout !== "fullWidth") {
    // Fullwidth images don't need dimensions
    console.error("Either aspectRatio or both width and height must be set");
    console.error("Image", image);
  }

  let breakpoints = getBreakpoints({ breakpoints: widths, layout: layout, width: width });
  breakpoints = [...new Set(breakpoints)].sort((a, b) => a - b);

  const srcset = (
    await transform(
      image,
      breakpoints,
      Number(width) || undefined,
      Number(height) || undefined,
      format
    )
  )
    .map(({ src, width }) => `${src} ${width}w`)
    .join(", ");

  return {
    attributes: {
      height: height,
      sizes: sizes,
      srcset: srcset || undefined,
      style: `${getStyle({
        aspectRatio: aspectRatio,
        height: height,
        layout: layout,
        objectPosition: objectPosition,
        width: width,
      })}${style ?? ""}`,
      width: width,
      ...rest,
    },
    src: typeof image === "string" ? image : image.src,
  };
}
