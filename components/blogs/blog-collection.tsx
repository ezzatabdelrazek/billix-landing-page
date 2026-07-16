"use client";

import { useState } from "react";
import BlogCard from "./blog-card";
import BubbleButton from "@/components/ui/bubble-button";
import { INTRO_STAGGER, LOADER_DELAY } from "@/constants";
import type { BlogPost } from "@/content/blogs";
import { useTranslations } from "next-intl";

const INITIAL_COUNT = 6;

const BlogCollection = ({ posts }: { posts: BlogPost[] }) => {
  const t = useTranslations("blogs.cards");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleBlogs = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <div className="grid-12 w-full px-(--container-px)">
      <div className="gap-xl col-span-12 flex flex-col items-center">
        <div data-reveal-group data-reveal-delay={LOADER_DELAY + INTRO_STAGGER} className="grid-12 gap-base w-full">
          {visibleBlogs.length > 0 ? (
            visibleBlogs.map(blog => (
              <div key={blog.slug} className="col-span-12 sm:col-span-6 md:col-span-4">
                <BlogCard
                  blog={{
                    coverLabel: blog.coverLabel,
                    title: blog.title,
                    category: blog.category,
                    author: blog.author,
                    href: `/blogs/${blog.slug}`,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-12 py-[8rem] text-center">
              <p className="body-base opacity-60">{t("noResults")}</p>
            </div>
          )}
        </div>
        {hasMore && (
          <BubbleButton variant="secondary" onClick={() => setVisibleCount(prev => prev + 6)}>
            {t("showMore")}
          </BubbleButton>
        )}
      </div>
    </div>
  );
};

export default BlogCollection;
