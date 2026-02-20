'use client';

import { useState } from 'react';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (data: {
        filename: string;
        title: string;
        description: string;
        subject: string;
        tags: string[];
        size: number;
    }) => void;
}

const subjects = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
    'Biology', 'Electronics', 'Mechanical', 'Civil',
    'Literature', 'History', 'Economics', 'Other'
];

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
    const [title, setTitle] = useState('');
    const [filename, setFilename] = useState('');
    const [subject, setSubject] = useState('Computer Science');
    const [description, setDescription] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [uploading, setUploading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            await onUpload({
                filename: filename || title.toLowerCase().replace(/\s+/g, '_') + '.pdf',
                title,
                description,
                subject,
                tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
                size: Math.floor(Math.random() * 5000000) + 500000,
            });
            setTitle('');
            setFilename('');
            setDescription('');
            setTagsInput('');
            onClose();
        } catch {
            // handle error
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">📤 Upload Resource</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            placeholder="e.g., Go Programming Fundamentals"
                            className="modal-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filename</label>
                        <input
                            type="text"
                            value={filename}
                            onChange={e => setFilename(e.target.value)}
                            placeholder="e.g., golang_tutorial.pdf (auto-generated if empty)"
                            className="modal-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                        <select
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="modal-input"
                        >
                            {subjects.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Brief description of the resource"
                            rows={3}
                            className="modal-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={e => setTagsInput(e.target.value)}
                            placeholder="e.g., golang, programming, tutorial"
                            className="modal-input"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
                        <button type="submit" className="btn btn-primary flex-1" disabled={uploading || !title}>
                            {uploading ? '⏳ Uploading...' : '📤 Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
