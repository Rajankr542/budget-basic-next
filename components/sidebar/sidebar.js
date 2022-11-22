import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { LocaleString, generateSubHeadings } from 'utils/helpers';
import useLayoutEffect from 'utils/use-isomorphic-layout-effect';
import useWindowDimensions from 'utils/useWindowDimensions';
import useDownloader from "react-use-downloader";
import { useRouter } from 'next/router';

function handleSidebarAnimation() {
  const articles = gsap.utils.toArray('article');
  articles.forEach((article) => {
    const sideLink = document.querySelector(
      `[keyid=${article.getAttribute('id')}]`
    );
    ScrollTrigger.create({
      id: `st-id`,
      trigger: article,
      start: 'top 60px',
      end: 'bottom 10px',
      refreshPriority: 1,
      toggleActions: 'restart complete reverse reset',
      onEnter() {
        sideLink.classList.add('content--active');
      },
      onLeave() {
        sideLink.classList.remove('content--active');
      },
      onEnterBack() {
        sideLink.classList.add('content--active');
      },
      onLeaveBack() {
        sideLink.classList.remove('content--active');
      },
    });
  });
}

function handleSubheadingAnimation() {
  const subheadings = gsap.utils.toArray('h3');
  subheadings.forEach((subheading, index) => {
    const subLink = document.querySelector(
      `li[subid=${subheading.getAttribute('id')}]`
    );
    ScrollTrigger.create({
      id: `subheading-id`,
      trigger: subheading,
      start: 'top 60px',
      endTrigger: () =>
        index == subheadings.length - 1
          ? subheading.parentElement.parentElement.nextSibling
          : subheadings[index + 1],
      end: () => (index < subheadings.length ? 'top 60px' : 'end 60px'),
      refreshPriority: 1,
      toggleActions: 'restart complete reverse reset',
      onEnter() {
        subLink.classList.add('sub-heading__link--active');
      },
      onLeave() {
        subLink.classList.remove('sub-heading__link--active');
      },
      onEnterBack() {
        subLink.classList.add('sub-heading__link--active');
      },
      onLeaveBack() {
        subLink.classList.remove('sub-heading__link--active');
      },
    });
  });
}

const Sidebar = ({ chapter, sections, activeChapterScheme }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { download } = useDownloader();

  // function printHtmlOfPage() {
  //   let url = router.asPath;
  //   fetch(`/print${url}`).then(function (response) {
  //     return response.text();
  //   }).then(function (html) {
  //     var printWindow = window.open('', '', 'height=900,width=1280');
  //     printWindow.document.write(html);
  //     printWindow.document.close();
  //   }).catch(function (err) {
  //     console.warn('Something went wrong.', err);
  //   });
  // }

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (sections.length > 0) {
      if (width >= 768) {
        handleSidebarAnimation();
        generateSubHeadings();
        handleSubheadingAnimation();
      }

      document.querySelectorAll('img').forEach((img) => {
        if (img.complete) {
          ScrollTrigger.refresh();
        } else {
          img.addEventListener('load', () => ScrollTrigger.refresh(), {
            passive: true,
          });
        }
      });
    }

    return () => {
      if (ScrollTrigger.getById('st-id')) {
        ScrollTrigger.getById('st-id').kill();
      }
      if (ScrollTrigger.getById('subheading-id')) {
        ScrollTrigger.getById('subheading-id').kill();
      }
    };
  }, [chapter, width]);

  return (
    <div className='sidebar-wrapper'>
    <div className='sidebar-wrapper-sticky'>
    <nav className="sidebar">
      <ul className="content">
      {/* <div className="sidebar_cahp_head">
        <h4>{chapter.Title}</h4>
      </div> */}
      
        {sections.map((article, index) => (
          <li
            className="content__container content__link"
            key={`sidebar-${article.id}`}
            keyid={article.slug}
          >
            <a href={`#${article.slug}`}>
              <p>{LocaleString(index + 1)}</p>
              <p>{article.Title}</p>
            </a>
            <ul className="sub-heading" />
          </li>
        ))}
      </ul>
    </nav>

    <div className='button-wrapper-of-sidebar'>
      <button className='download-button' onClick={
        () => download(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${activeChapterScheme.downloadPDF.url}`,activeChapterScheme.downloadPDF.name)
      }
        >Download Factsheet</button>
      <button className='download-button dataset' onClick={
        () => download(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${activeChapterScheme.downloadDataset.url}`,activeChapterScheme.downloadDataset.name)
      }
        >Download Dataset</button>
    </div>
    </div>
    </div>
  );
};

export default Sidebar;
