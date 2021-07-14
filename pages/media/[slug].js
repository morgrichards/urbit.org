import { useRouter } from "next/router";
import {
  getPostBySlug,
  getAllPosts,
  getNextPost,
  getPreviousPost,
  formatDate,
} from "../../lib/lib";
import ErrorPage from "../404";
import Container from "../../components/Container";
import Markdown from "../../components/Markdown";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SingleColumn from "../../components/SingleColumn";
import Contact from "../../components/Contact";
import PostPreview from "../../components/PostPreview";
import Section from "../../components/Section";
import { contact } from "../../lib/constants";
import markdownStyles from "../../styles/markdown.module.css";
import { decode } from "html-entities";

export default function MediaPage({ post, markdown, search }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage />;
  }
  return (
    <Container>
      <SingleColumn>
        <Header search={search} />
        <Section narrow short>
          <h1>{post.title}</h1>
          {post.extra.author ? (
            <div className="type-ui text-gray mt-4 md:mt-8 lg:mt-10">
              {post.extra.author}
            </div>
          ) : null}
          {post.extra.ship ? (
            <div className="type-ui text-gray font-mono">{post.extra.ship}</div>
          ) : null}
          <div className="type-ui text-gray mt-16">
            {formatDate(new Date(post.date))}
          </div>
        </Section>
        <Section narrow>
          {post.extra.youtube ? (
            <iframe
              className="rounded-xl"
              width="100%"
              height="640px"
              src={`https://www.youtube.com/embed/${post.extra.youtube}`}
              frameborder="0"
              allow="encrypted-media"
              allowfullscreen
            ></iframe>
          ) : null}
          {post.extra.soundcloud ? (
            <iframe
              width="100%"
              height="300"
              scrolling="no"
              frameborder="no"
              allow="autoplay"
              src={post.extra.soundcloud}
            ></iframe>
          ) : null}
        </Section>
        <Section narrow className={markdownStyles["markdown"]}>
          <article
            className="pt-12 w-full"
            dangerouslySetInnerHTML={{ __html: decode(markdown) }}
          ></article>
        </Section>
        <Section narrow>
          <Contact />
        </Section>
      </SingleColumn>
      <Footer />
    </Container>
  );
}

//
export async function getStaticProps({ params }) {
  const post = getPostBySlug(
    params.slug,
    ["title", "slug", "date", "description", "content", "extra"],
    "media"
  );

  const markdown = await Markdown({ post });

  return {
    props: { post, markdown },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug", "date"], "media");

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
