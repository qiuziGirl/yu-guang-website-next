export default function Loading() {
  return (
    <section className="bg-gray-100 min-h-screen">
      {/* 轮播图骨架屏 */}
      <div className="h-[490px] bg-gray-200 animate-pulse" />

      {/* 分类区域骨架屏 */}
      <div className="max-w-[1400px] mx-auto px-10 py-12">
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse mb-10" />

        <div className="grid grid-cols-12 gap-8">
          {/* 左侧大图骨架 */}
          <div className="col-span-5">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="h-[450px] bg-gray-200 animate-pulse" />
              <div className="p-8">
                <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-5" />
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* 右侧分类卡片骨架 */}
          <div className="col-span-7">
            <div className="grid grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="h-12 bg-gray-200 animate-pulse" />
                  <div className="h-[200px] bg-gray-100 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 视频区域骨架屏 */}
      <div className="max-w-[1400px] mx-auto px-10 py-16">
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[350px] bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
