// components/VideoAd.tsx
export default function VideoAd() {
    return (
      <div className="my-6">
        <p className="text-sm text-gray-600 mb-2">Sponsored Video</p>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.youtube.com/embed/xyz123"
            title="Promo Video"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      </div>
    );
  }
  