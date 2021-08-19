import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { fetchAPI } from 'lib/api';
import { sortList, stripTable, tooltipKeyword } from 'utils/helpers';
import useWindowDimensions from 'utils/useWindowDimensions';
import Seo from 'components/seo';
import Header from 'components/header/header';
import Navigation from 'components/navigation/navigation';
import Menu from 'components/menu/menu';
import Sidebar from 'components/sidebar/sidebar';
import useLayoutEffect from 'utils/use-isomorphic-layout-effect';

function goToTopHandler() {
  if (window.scrollY > 600)
    document.querySelector('.backToTop').classList.add('active');
  else document.querySelector('.backToTop').classList.remove('active');
}

const Chapter = ({ chapter, chapters }) => {
  const { width } = useWindowDimensions();

  useLayoutEffect(() => {
    const jumpIcon = document.querySelector('.backToTop');
    gsap.registerPlugin(ScrollTrigger);

    if (chapter.sections.length > 0) {
      stripTable();
      tooltipKeyword(chapter);
    }

    // go-to-top
    document.addEventListener('scroll', goToTopHandler);
    jumpIcon.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return () => {
      jumpIcon.removeEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.removeEventListener('scroll', goToTopHandler);
    };
  }, [chapter, width]);

  sortList(chapter.sections);
  sortList(chapters);

  const seo = {
    metaTitle: chapter.Title,
    metaDescription: chapter.Desc,
    article: true,
    icon: chapter.icon,
  };

  function headerDesc() {
    return <h2>{chapter.Title}</h2>;
  }

  return (
    <div>
      <Seo seo={seo} />

      <Header desc={headerDesc()} color="#29314F" />
      {width < 768 && chapter.sections.length > 0 && (
        <Menu chapter={chapter} isMobile={width < 768} />
      )}
      {chapter.sections.length > 0 ? (
        <div className="article-content wrapper">
          <Sidebar chapter={chapter} />

          <section className="articles">
            {chapter.sections.map((article) => (
              <article id={article.slug} key={article.id}>
                <div className="article_heading">
                  <span />
                  <h2>
                    {article.Title}
                    <a href={`#${article.slug}`} className="header-anchor">
                      #
                    </a>
                  </h2>
                </div>

                <div
                  className="articleContent"
                  dangerouslySetInnerHTML={{ __html: article.Content }}
                />
              </article>
            ))}
          </section>
        </div>
      ) : (
        <div className="noContent">
          <p>To be updated soon</p>
        </div>
      )}

      <Navigation
        back={chapters[chapter.Chapter_No - 2]}
        forward={chapters[chapter.Chapter_No]}
      />
      <a className="backToTop" href="#to-top">
        <span className="screen-reader-text">Back to Top</span>
        <svg width="32" height="32" viewBox="0 0 100 100">
          <path
            d="m50 0c-13.262 0-25.98 5.2695-35.355 14.645s-14.645 22.094-14.645 35.355 
          5.2695 25.98 14.645 35.355 22.094 14.645 35.355 14.645 25.98-5.2695 35.355-14.645 
          14.645-22.094 14.645-35.355-5.2695-25.98-14.645-35.355-22.094-14.645-35.355-14.645zm20.832 
          62.5-20.832-22.457-20.625 22.457c-1.207 0.74219-2.7656 0.57812-3.7891-0.39844-1.0273-0.98047-1.2695-2.5273-0.58594-3.7695l22.918-25c0.60156-0.61328 
          1.4297-0.96094 2.2891-0.96094 0.86328 0 1.6914 0.34766 2.293 0.96094l22.918 25c0.88672 1.2891 0.6875 3.0352-0.47266 4.0898-1.1562 1.0508-2.9141 1.0859-4.1133 0.078125z"
          />
        </svg>
      </a>
    </div>
  );
};

export async function getStaticPaths() {
  const chapters = await fetchAPI('/chapters');
  return {
    paths: chapters.map((chapter) => ({
      params: {
        chapter: chapter.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const chapter = await fetchAPI(`/chapters?slug=${params.chapter}`);
  const chapters = await fetchAPI(`/chapters`);

  return {
    props: { chapter: chapter[0], chapters },
    revalidate: 1,
  };
}

export default Chapter;
