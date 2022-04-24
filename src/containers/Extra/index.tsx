import React, { useEffect, useCallback, useRef } from 'react';

import useMedia from 'utils/media';

import Skills from 'sections/Skills';
import Languages from 'sections/Languages';
import References from 'sections/References';

import Photos from './Photos';

import s from './styles.module.scss';

const Name = () => {
  const { isMobile, isPortrait } = useMedia();
  const needName = isMobile || isPortrait;
  return needName ? <h1 className={s.name}>Artur Blieshcheiev</h1> : null;
};

const ReferencesBlock = () => {
  const { isDesktop, isLandscape } = useMedia();
  const needReferences = isDesktop || isLandscape;
  return needReferences ? <References /> : null;
};

export default () => {
  const { isDesktop, isLandscape } = useMedia();
  const needScrollEffect = isDesktop || isLandscape;

  const prevScrollTopRef = useRef<number>(0);
  const scrollBarWidthRef = useRef<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(({ currentTarget }) => {
    const { scrollY } = currentTarget;
    const delta = scrollY - prevScrollTopRef.current;
    const root = contentRef.current as HTMLDivElement;
    const content = root.childNodes[0] as HTMLDivElement;
    const rootHeight = root.offsetHeight;
    const contentHeight = content.offsetHeight;
    const maxMarginTop = rootHeight - contentHeight;
    const currentMarginTop = parseInt(content.style.marginTop, 10) || 0;
    let newMarginTop = currentMarginTop - delta;
    if (newMarginTop < maxMarginTop) {
      newMarginTop = maxMarginTop;
    } else if (newMarginTop > 0) {
      newMarginTop = 0;
    }
    content.style.marginTop = `${newMarginTop}px`;
    prevScrollTopRef.current = scrollY;
  }, []);

  useEffect(() => {
    scrollBarWidthRef.current = window.innerWidth - document.body.offsetWidth;
    if (!needScrollEffect) {
      const root = contentRef.current as HTMLDivElement;
      const content = root.childNodes[0] as HTMLDivElement;
      content.style.marginTop = '0';
      return;
    }
    window.addEventListener('scroll', onScroll);
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('scroll', onScroll);
  }, [needScrollEffect]);

  const onGalleryToggle = useCallback((show: boolean) => {
    (contentRef.current as HTMLDivElement).style.paddingRight = `${
      show ? scrollBarWidthRef.current : 0
    }px`;
  }, []);

  return (
    <div className={s.root} ref={contentRef}>
      <div className={s.content}>
        <Photos
          onGalleryToggle={onGalleryToggle}
          className={s.avatarContainer}
        />
        <Name />
        <Skills />
        <Languages />
        <ReferencesBlock />
      </div>
    </div>
  );
};
