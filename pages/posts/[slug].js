import styles from "../../styles/Slug.module.css";
import { GraphQLClient, gql } from "graphql-request";
import { useRouter } from "next/router";

const graphcms = new GraphQLClient(
  "https://api-eu-west-2.hygraph.com/v2/cl8cfraay0ld901t718062pot/master"
);

// for the data to be displayed
const QUERY = gql`
  query Post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      datePublished
      author {
        id
        name
        avatar {
          url
        }
      }
      content {
        html
      }
      coverPhoto {
        id
        url
      }
    }
  }
`;

// to get all the slug that would be prefetched, passed into getStaticPaths
const SLUGLIST = gql`
  {
    posts {
      slug
    }
  }
`;

// in order to get the paths to be prefetched
export async function getStaticPaths() {
  const { posts } = await graphcms.request(SLUGLIST);
  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: true,
  };
}

//  to fetch particular post
export async function getStaticProps({ params }) {
  const slug = params.slug;

  console.log(slug);
  const { post } = await graphcms.request(QUERY, { slug });
  // const post

  return {
    props: {
      post,
    },
    revalidate: 10,
  };
}

export default function BlogPost({ post }) {
  const router = useRouter();
  const { coverPhoto, slug, author, datePublished, title, content } = post;

  if (router.isFallback) {
    return (
      <>
        <h2>Loading...</h2>
      </>
    );
  }

  return (
    <main className={styles.container}>
      <img src={coverPhoto.url} alt={slug} className={styles.cover} />

      <div className={styles.title}>
        <img src={author.avatar.url} alt={slug} />

        <aside className={styles.authtext}>
          <h6>By {post.author.name}</h6>
          <h6 className={styles.date}>{datePublished}</h6>
        </aside>
      </div>
      <h2>{title}</h2>
      <div
        className="styles.content"
        dangerouslySetInnerHTML={{ __html: content.html }}
      ></div>
    </main>
  );
}
