import Link from "next/link";
import styles from "../styles/BlogCard.module.css";

function BlogPost({ id, title, datePublished, slug, author, coverPhoto }) {
  return (
    <div className={styles.card}>
      <Link href={`/posts/${slug}`}>
        <div className={styles.imgContainer}>
          <img src={coverPhoto.url} alt="blog-image" />
        </div>
      </Link>
      <div className={styles.text}>
        <h2>{title}</h2>
        <article className={styles.details}>
          <div className={styles.author}>
            <img src={author.avatar.url} alt="" />
            <h3>{author.name}</h3>
          </div>
          <aside className={styles.date}>
            <h3>{datePublished}</h3>
          </aside>
        </article>
      </div>
    </div>
  );
}

export default BlogPost;
