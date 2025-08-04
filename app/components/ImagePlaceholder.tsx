interface ImagePlaceholderProps {
  width: number;
  height: number;
  text?: string;
  className?: string;
}

export default function ImagePlaceholder({ width, height, text = "Image", className = "" }: ImagePlaceholderProps) {
  const colors = [
    'bg-gradient-to-br from-pink-100 to-purple-100',
    'bg-gradient-to-br from-blue-100 to-indigo-100',
    'bg-gradient-to-br from-green-100 to-teal-100',
    'bg-gradient-to-br from-yellow-100 to-orange-100',
    'bg-gradient-to-br from-red-100 to-pink-100',
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      className={`${randomColor} flex items-center justify-center rounded-lg ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="text-center">
        <div className="text-2xl mb-2">👗</div>
        <div className="text-xs text-gray-600 font-medium">{text}</div>
      </div>
    </div>
  );
} 