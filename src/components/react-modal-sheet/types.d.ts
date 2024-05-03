/// <reference types="react" />
import { DragHandlers, MotionValue, MotionProps, motion, EasingDefinition, Transition } from 'framer-motion';
export declare type SheetEvents = {
    onOpenStart?: () => void;
    onOpenEnd?: () => void;
    onCloseStart?: () => void;
    onCloseEnd?: () => void;
    onSnap?: (index: number) => void;
};
export declare type SheetDetent = 'full-height' | 'content-height';
declare type CommonProps = MotionProps & {
    className?: string;
};
export declare type SheetTweenConfig = {
    ease: EasingDefinition;
    duration: number;
};
export declare type SheetProps = {
    isOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
    rootId?: string;
    mountPoint?: Element;
    snapPoints?: number[];
    detent?: SheetDetent;
    initialSnap?: number;
    tweenConfig?: SheetTweenConfig;
    disableDrag?: boolean;
    prefersReducedMotion?: boolean;
    dragVelocityThreshold?: number;
    dragCloseThreshold?: number;
} & SheetEvents & React.ComponentPropsWithoutRef<typeof motion.div>;
export declare type SheetContainerProps = Omit<CommonProps, 'initial' | 'animate' | 'exit' | 'onAnimationComplete'> & {
    children: React.ReactNode;
};
export declare type SheetDraggableProps = Omit<CommonProps, 'drag' | 'dragElastic' | 'dragConstraints' | 'dragMomentum' | 'onDrag' | 'onDragStart' | 'onDragEnd'> & {
    children?: React.ReactNode;
    disableDrag?: boolean;
};
export declare type SheetBackdropProps = Omit<CommonProps, 'initial' | 'animate' | 'exit'>;
export declare type SheetScrollerProps = React.HTMLAttributes<HTMLDivElement> & {
    draggableAt?: 'top' | 'bottom' | 'both';
};
export declare type SheetDragProps = {
    drag: 'y';
    dragElastic: number;
    dragConstraints: any;
    dragMomentum: boolean;
    dragPropagation: boolean;
    onDrag: DragHandlers['onDrag'];
    onDragEnd: DragHandlers['onDragEnd'];
};
export declare type SheetContextType = {
    y: MotionValue<any>;
    sheetRef: React.MutableRefObject<any>;
    isOpen: boolean;
    snapPoints: SheetProps['snapPoints'];
    detent: SheetDetent;
    initialSnap: SheetProps['initialSnap'];
    indicatorRotation: MotionValue<number>;
    callbacks: React.MutableRefObject<SheetEvents>;
    dragProps?: SheetDragProps;
    windowHeight: number;
    animationOptions: Transition;
    reduceMotion: boolean;
    disableDrag: boolean;
};
export declare type SheetScrollerContextType = {
    disableDrag: boolean;
    setDragDisabled: () => void;
    setDragEnabled: () => void;
};
declare type ContainerComponent = React.ForwardRefExoticComponent<SheetContainerProps & React.RefAttributes<any>>;
declare type DraggableComponent = React.ForwardRefExoticComponent<SheetDraggableProps & React.RefAttributes<any>>;
declare type BackdropComponent = React.ForwardRefExoticComponent<SheetBackdropProps & React.RefAttributes<any>>;
declare type SheetComponent = React.ForwardRefExoticComponent<SheetProps & React.RefAttributes<any>>;
declare type ScrollerComponent = React.ForwardRefExoticComponent<SheetScrollerProps & React.RefAttributes<any>>;
declare type SheetCompoundComponent = {
    Container: ContainerComponent;
    Header: DraggableComponent;
    Content: DraggableComponent;
    Backdrop: BackdropComponent;
    Scroller: ScrollerComponent;
};
export declare type SheetCompound = SheetComponent & SheetCompoundComponent;
export {};
