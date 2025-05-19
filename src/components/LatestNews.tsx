import React from "react";

interface Props {
    news: string[]
}

export const LatestNews: React.FC<Props> = ({news}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">🗞️ Latest News</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
                {news.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>
    )
}
