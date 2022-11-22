import React, { useEffect, useRef, useState} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { fetchAPI } from 'lib/api';
import { sortList, stripTable, LocaleString ,tooltipKeyword } from 'utils/helpers';
import useWindowDimensions from 'utils/useWindowDimensions';
import useLayoutEffect from 'utils/use-isomorphic-layout-effect';
import { useRouter } from 'next/router';

function goToTopHandler() {
  if (window.scrollY > 600)
    document.querySelector('.back-top').classList.add('active');
  else document.querySelector('.back-top').classList.remove('active');
}

const Chapter = ({ homepage, chapter, chapters, schemes }) => {
  const ref1 = useRef();
  const ref2 = useRef()
const router = useRouter();
let activeSchemes;
const [chapter_slug, setChapterSlug] = useState("");
const [active_scheme, setActiveSchemeID] = useState("");
const [modal1, setModal1] = useState(false);
const [modal2, setModal2] = useState(false);

const toReplaceBaseURLofImage = (content) => {
  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
let data = content?.replaceAll("/uploads/", `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/uploads/`);
return data;
}

useEffect(() => {
  const checkIfClickedOutside = e => {
    if (modal1 && ref1.current && !ref1.current.contains(e.target)) {
      setModal1(false);
    }
    if (modal2 && ref2.current && !ref2.current.contains(e.target)) {
      setModal2(false);
    }
  }

  document.addEventListener("mousedown", checkIfClickedOutside)

  return () => {
    document.removeEventListener("mousedown", checkIfClickedOutside)
  }
}, [modal1, modal2])

const onChangeDropdown = (field, event) => {
if(field === "chapter") {
  setChapterSlug(event.target.value);
  } else {
    setActiveSchemeID(event.target.value);
  }
}
const onClickModalButton = (model) => {
if( model=== 1){
  setModal1(true);
} else {
  setModal2(true);
}
}

const onClickButton = () => {
  let url;
  if(chapter_slug) {
    url = `/${chapter_slug}?scheme=${active_scheme}`;
  } else {
    url = `/${chapter.slug}?scheme=${active_scheme}`;
  }
  router.push(url);
}

const getAbbriviation = (input) => {
  let datatoReturn = input;
  if(input === 'Integrated Child Development Scheme') {
    datatoReturn = "ICDS"
  } 
  if(input === 'Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS)') {
    datatoReturn = "MGNREGS"
  } 
  if(input === 'Pradhan Mantri Awas Yojana') {
    datatoReturn = "PMAY-G"
  } 
  if(input === 'Mid-Day Meal Scheme (MDM)') {
    datatoReturn = "MDM"
  } 
  if(input === 'National Health Mission') {
    datatoReturn = "NHM"
  } 
  return datatoReturn;
}

const path = router.asPath;
const scheme = path.split("?scheme=")[1];
  if(scheme) {
    activeSchemes = schemes.find( (item) => item.slug === scheme);
    if(activeSchemes) {
    } else {
      activeSchemes =schemes[3];
    }
  } else {
    activeSchemes =schemes[3];
  }
  const activeChapterScheme = chapter.chapter_schemes.find( (item) => item.scheme === activeSchemes?.id);
  const sections = chapter.sections.filter( (item) => item.scheme === activeSchemes?.id);
  //important step
  const { width } = useWindowDimensions();
  useLayoutEffect(() => {
    const jumpIcon = document.querySelector('.back-top');
    gsap.registerPlugin(ScrollTrigger);

    if (sections.length > 0) {
      stripTable();
      tooltipKeyword(chapter);
    }
    let url = router.pathname;
    if(url.includes('#')){
      let idPresent = url.split('#').pop();
      let element =  document.querySelector(`#${idPresent}`);
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }

    // go-to-top
    document.addEventListener('scroll', goToTopHandler);
    jumpIcon.addEventListener('click', (e) => {
      e.preventDefault();
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.querySelector('#top-of-site-pixel-anchor').focus({
          preventScroll: true,
        });
      }, 10);
    });
    return () => {
      jumpIcon.removeEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.removeEventListener('scroll', goToTopHandler);
    };
  }, [chapter, width]);

  sortList(sections);
  sortList(chapters);
const SEOTitle = `${chapter?.Title} , ${activeSchemes?.Name}`;
  const seo = {
    metaTitle: SEOTitle,
    metaDescription: activeChapterScheme?.Factsheet,
    article: true,
    icon: chapter.icon,
  };

  function headerDesc() {
    return <h2>{chapter.Title}</h2>;
  }

  return (
    <>
      {/* <Seo seo={seo} /> */}
      {/* <Header color="#212142" titleNew={"Analysis of Fiscal Data for Select Districts"} /> */}
      {/* {width < 1025 && sections.length > 0 && (
        <Menu chapter={chapter} isMobile={width < 1025} />
      )} */}
      {/* <div className="skiptarget">
        <span id="maincontent">-</span>
      </div>
      <div className='detailpage-selector-head'>
        <div className='selector-dropdown'>
            <select name='chapter' id='chapter' onChange={(e) => onChangeDropdown("chapter",e)}>
            {chapters.map((one) => {
              return <option key={one.slug} value={one.slug} selected={chapter.slug === one.slug}>{one.Title}</option>
            }
            )}
            </select>
        </div>
        <div className='selector-dropdown'>
            <select name='scheme' id='scheme' onChange={(e) => onChangeDropdown("scheme",e)} >
            {schemes.map((one) => {
              return <option key={one.slug} value={one.slug} selected={activeSchemes.slug === one.slug}>{one.Name}</option>
            }
            )}
            </select>
        </div>
        <div className='selector-button'>
          <button className='view-performnace' id='view-performnace' onClick={onClickButton}>
          View Performance
          </button>
        </div>
      </div> */}
      {sections.length > 0 ? (
        <main id="main" className="chapter wrapper fullWidth_important">
          {/* <Sidebar chapter={chapter} sections={sections} activeChapterScheme={activeChapterScheme}/> */}
          <section className="chapter__container">
          <div className="chapter_heading_image">
            <div className='chapter_detail-newsection'>
              <div className='upperhalf-section'>
                  <div className='chapter-new-head'>
                    <h1>{chapter?.Title}</h1>
                    <h4>{activeSchemes?.Name}</h4>
                  </div>
                  <div className='chapter-new-head-image'>
                      <picture className="chapter_map_img">
                      <source
                      srcSet={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${chapter.detail_map.url}`}
                      media="(min-width: 100px)"
                      />
                      <img
                      src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                      alt=""
                      width="150"
                      height="120"
                      />
                      </picture>
                  </div>
              </div>
              <div className='middle-image-section'>
                <div className='background-hyphen-ovelay'></div>
                      <picture className="chapter_overlay_img">
                          <source
                          srcSet={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${activeSchemes?.scheme_icon.url}`}
                          media="(min-width: 100px)"
                          />
                          <img
                          src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                          alt=""
                          width="180"
                          height="180"
                          />
                      </picture>
              </div>
              <div className='lowerhalf-section'>
                <div className='author-section'>
                  <p><span>Author: </span>  {activeChapterScheme?.Author === 'Suraj Jaiswal' ? <a target={"_blank"} href='https://www.cbgaindia.org/teams/suraj-prasad-jaiswal-2/'>{activeChapterScheme?.Author}</a> : activeChapterScheme?.Author}</p>
                </div>
                <div className='lowerhalf-text section-1'>
                  <p>{activeChapterScheme?.Factsheet}</p>
                </div>
                <div className='lowerhalf-text section-2'>
                  <p>{activeChapterScheme?.popup1text}
                     {/* <span onClick={() => onClickModalButton(1)}> {activeChapterScheme?.popup1button}</span> */}
                  </p>
                            <div className='popuptoshowonpage'
                            ref={ref1}
                            dangerouslySetInnerHTML={{ __html: toReplaceBaseURLofImage(activeChapterScheme.Pop1Content) }}          
                            />
                </div>
                <div className='lowerhalf-text section-3'>
                  <p>{activeChapterScheme?.popup2text}
                    {/* <span onClick={() => onClickModalButton(2)}> {activeChapterScheme?.popup2button}</span> */}
                  </p>
                  <div className='popuptoshowonpage'
                    ref={ref2}
                    dangerouslySetInnerHTML={{ __html: toReplaceBaseURLofImage(activeChapterScheme.pop2Content) }}          
          />
                </div>
              </div>
            </div>
           </div>
            {sections.map((article, index) => (
              <article className="section chapter-content-container" id={article.slug} key={article.id}>
                 <div className="chapter_body_padding"> 
                  <div className="section__heading">
                    <h2 className="section_number_chap">{LocaleString(index+1)}.</h2>
                    <span className="section__bar" />
                    <h2>{article.Title}</h2>
                    <a href={`#${article.slug}`} className="section__anchor">
                      <span aria-hidden="true">
                        {/* # */}
                      </span>
                      <span className="screen-reader-text">
                        {`Section titled ${article.Title}`}
                      </span>
                    </a>
                  </div>

                  <div
                    className="section__content"
                    dangerouslySetInnerHTML={{ __html: toReplaceBaseURLofImage(article.Content) }}
                  />
                </div>
              </article>
            ))}
          </section>
        </main>
      ) : (
        <div className="no-content">
          <p>To be updated soon</p>
        </div>
      )}
    {/* <section className="seggestion-section-chapter-page">
      <div className="wrapper">
          <div className="suggestion_head">
            <h2>You may also like</h2>
          </div>
          <div className="card_suggestion_container">
          <ul className="card_suggestion_ul">
          {schemes.map((one, index) => {
            if(one.slug !== activeSchemes.slug)
            return (
              <li className="suggestion_card">
                <Link key={index} href={`/${chapter.slug}?scheme=${one.slug}`}>
                  <a>
                <div className="suggestion_img_container">
                  <img src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${one.scheme_image.url}`} />
                  <div className="text_suggestion_container">
                  <div className="chapter_suggestion_head">
                    <h4>{chapter.Title + " , " + getAbbriviation(one.Name)}</h4>
                  </div>
                </div>
                </div>
                </a>
              </Link>
              </li>
            );
          }
          )}
        </ul>
          </div>
        <div className="suggesstion_card_container">

        </div>
      </div>   
    </section> */}
      {/* <Carousel youtube={homepage.youtube} /> */}

      <a href="#top-of-site-pixel-anchor" type="button" className="back-top">
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

      {modal1 && (
        <div className='chapter_detaild_model-one'>
          <div className='chapter_detaild_model-one-content'
          ref={ref1}
           dangerouslySetInnerHTML={{ __html: toReplaceBaseURLofImage(activeChapterScheme.Pop1Content) }}          
          />
        </div>
      )}
    {modal2 && (
        <div className='chapter_detaild_model-one model-2'>
          <div className='chapter_detaild_model-one-content model-2'
          ref={ref2}
           dangerouslySetInnerHTML={{ __html: toReplaceBaseURLofImage(activeChapterScheme.pop2Content) }}          
          />
        </div>
      )}
    </>
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
  const homepage = await fetchAPI('/homepage');
  const chapter = await fetchAPI(`/chapters?slug=${params.chapter}`);
  const chapters = await fetchAPI(`/chapters`);
  const schemes = await fetchAPI(`/schemes`);
  return {
    props: { homepage,chapter: chapter[0], chapters, schemes },
    revalidate: 1,
  };
}

export default Chapter;
