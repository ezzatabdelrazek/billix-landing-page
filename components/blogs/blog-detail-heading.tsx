import PageHeading from "@/components/ui/page-heading";
import { Link } from "@/i18n/navigation";
import SparklesPenIcon from "@/icons/ui/sparkles-pen-icon";
import { INTRO_STAGGER, LOADER_DELAY } from "@/constants";
import { getCategorySlug, getTagSlug } from "@/content/blogs";

const BlogDetailHeading = ({
  category,
  tags,
  title,
  description,
  date,
  author,
  readTime,
}: {
  category: string;
  tags: string[];
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: string;
}) => {
  return (
    <div className="gap-base flex flex-col">
      <PageHeading eyebrow={category} title={title} description={description} />

      <div
        data-reveal-group
        data-reveal-delay={LOADER_DELAY + INTRO_STAGGER}
        className="body-base-sm flex flex-wrap items-center justify-center gap-[0.4rem]"
      >
        <div className="border-foreground text-foreground px-base py-sm grid place-content-center rounded-full border border-dashed leading-none">
          {date}
        </div>
        <div className="border-foreground text-foreground px-base py-sm grid place-content-center rounded-full border border-dashed leading-none">
          {readTime}
        </div>
        <div className="flex items-stretch gap-0">
          <div className="bg-foreground px-base py-sm text-background grid place-content-center rounded-full leading-none">
            {author}
          </div>
          <div className="border-foreground text-foreground grid w-[3.2rem] shrink-0 place-content-center rounded-full border border-dashed">
            <SparklesPenIcon />
          </div>
        </div>
      </div>

      <div
        data-reveal-group
        data-reveal-delay={LOADER_DELAY + INTRO_STAGGER}
        className="body-base-sm flex flex-wrap items-center justify-center gap-[0.4rem]"
      >
        <Link
          href={`/blogs/category/${getCategorySlug(category)}`}
          className="bg-foreground text-background px-base py-sm ease-out-quad grid place-content-center rounded-full leading-none transition-opacity hover:opacity-80"
        >
          {category}
        </Link>
        {tags.map(tag => (
          <Link
            key={tag}
            href={`/blogs/tag/${getTagSlug(tag)}`}
            className="border-foreground text-foreground px-base py-sm ease-out-quad grid place-content-center rounded-full border border-dashed leading-none transition-colors hover:opacity-70"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogDetailHeading;
