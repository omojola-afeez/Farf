import { categories } from '@/lib/categories';

// Shows a real photo without cropping it. When there is no photo, shows a plain placeholder.
// `ratio` lets the product page match the container to the photo's real width and height.
export default function ProductImage({ image, name, category, ratio = 1, width = 600, maxHeight }) {
  const accent = categories[category]?.accent;
  const style = { aspectRatio: String(ratio), ...(maxHeight ? { maxHeight } : {}) };

  if (!image?.url) {
    return (
      <div
        className={`flex w-full items-center justify-center ${accent?.soft || 'bg-slate-100'}`}
        style={style}
        role="img"
        aria-label={`No photo yet for ${name}`}
      >
        <span className="px-4 text-center text-sm font-medium text-slate-600">No photo yet</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/60" style={style}>
      <img
        src={`${image.url}?w=${width}&auto=format`}
        alt={image.alt || name}
        width={image.width || undefined}
        height={image.height || undefined}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
