import { mergeCls } from '@/utils';
import NextImage from 'next/image';
import React, { Children, isValidElement } from 'react';

type ImageProps = React.ComponentProps<typeof NextImage> & {
  wrapper?: React.ElementType | null;
};
export function Image(props: ImageProps) {
  const { wrapper = PlaceholderWrapper, width, height, ...rest } = props;

  const Wrapper = wrapper || React.Fragment;

  return (
    <Wrapper fallback="color">
      <NextImage width={width} height={height} {...rest} />
    </Wrapper>
  );
}

type ImageWrapperProps = JSX.IntrinsicElements['div'] & {
  fallback?: 'color' | 'blur' | 'none';
  asChild?: boolean;
  debug?: boolean;
};
export function PlaceholderWrapper(props: ImageWrapperProps) {
  const { children, fallback = 'color', asChild, className, ...rest } = props;
  Children.only(children);
  if (props.debug) {
    console.log({ children, fallback, asChild, isValidElement: isValidElement(children) });
  }

  if (isValidElement(children) && asChild) {
    return React.cloneElement(children, { ...children.props, fallback, ...rest });
  }

  return (
    <div
      className={mergeCls('image-wrapper', fallback === 'color' && 'fallback-color', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
