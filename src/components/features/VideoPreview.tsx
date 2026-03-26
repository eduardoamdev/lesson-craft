interface VideoPreviewProps {
  videoId?: string;
  age?: string;
  level?: string;
}

export default function VideoPreview({
  videoId,
  age,
  level,
}: VideoPreviewProps) {
  if (!videoId) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-[#121212] rounded-[2rem] border border-white/5 border-dashed">
        <div className="text-gray-500 animate-pulse flex flex-col items-center gap-3">
          <p>Video not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative p-6 sm:p-8 overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl bg-[#121212] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-[#b388ff]">
              Source Video
            </h2>
            <p className="text-sm text-slate-400">
              Review the original video alongside the generated activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {level ? (
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-200">
                Level: {level}
              </span>
            ) : null}
            {age ? (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                Age: {age}
              </span>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-white/5 bg-black shadow-lg">
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Generated lesson source video"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
