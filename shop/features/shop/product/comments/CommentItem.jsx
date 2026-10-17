"use client";

import { memo } from "react";
import { useLocale } from "next-intl";

import Avatar from "./Avatar";
import { Stars } from "./Rating";

function CommentItem({ comment }) {
    const locale = useLocale();

    return (
        <li className="p-5 border border-gold/20 rounded-xl bg-white">
            <div className="flex items-start gap-3 mb-3">
                <Avatar
                    name={comment.customerName}
                    image={comment.customerImage}
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold text-ink text-sm truncate">
                            {comment.customerName}
                        </span>

                        {comment.createdAt && (
                            <time
                                dateTime={comment.createdAt}
                                className="text-xs text-slate-400 shrink-0"
                            >
                                {new Date(comment.createdAt).toLocaleDateString(
                                    locale,
                                )}
                            </time>
                        )}
                    </div>

                    {comment.rating != null && (
                        <Stars value={comment.rating} size={14} />
                    )}
                </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line break-words">
                {comment.content}
            </p>
        </li>
    );
}

export default memo(CommentItem);
