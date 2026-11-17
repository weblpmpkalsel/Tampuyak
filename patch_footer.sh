sed -i '/<div className={`text-gray-900 ${isCover ? '\''text-center h-full flex flex-col justify-between'\'' : '\'''\''}`} >/a\
        {isFirst || isCover ? null : <div className="absolute bottom-6 left-0 right-0 text-center text-sm font-serif print:block">{pageNumbers?.[section.chapterId] || '\'''\''}</div>}' src/enterprise/workspace/preview/CanonicalRenderer.tsx
