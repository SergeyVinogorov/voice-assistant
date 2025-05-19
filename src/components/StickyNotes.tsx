import React from "react";

interface Props {
    notes: string[];
}

export const StickyNotes: React.FC<Props> = ({ notes }) => (
    <div>
        <h2 className="text-xl font-semibold mb-2">🗒️ Sticky Notes</h2>
        <div className="flex flex-wrap gap-4">
            {notes.map((note, i) => (
                <div key={i} className="w-48 h-48 bg-yellow-200 shadow-md p-4 rounded-md text-gray-800 text-sm overflow-auto">
                    {note}
                </div>
            ))}
        </div>
    </div>
);
