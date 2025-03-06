import { classNames } from "shared/lib/classNames/classNames";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import cls from "./Modal.module.scss";
import { Portal } from "../Portal/Portal";
import { useTheme } from "app/providers/ThemeProvider";

interface ModalProps {
  className?: string;
  children?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Modal = (props: ModalProps) => {
  const { className, children, isOpen, onClose } = props;

  const [isClosing, setIsClosing] = useState(false);
  const timeRef = useRef<ReturnType<typeof setTimeout>>();
  const {theme}=useTheme()

  const mods: Record<string, boolean> = {
    [cls.opened]: isOpen,
    [cls.isClosing]: isClosing,
    [cls[theme]]:true
  };

  const ANIMATION_DELAY = 300;

  const closeHalndler = useCallback(() => {
    if (onClose) {
      setIsClosing(true);
      // onClose();
      timeRef.current = setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, ANIMATION_DELAY);
    }
  }, [onClose]);
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeHalndler();
      }
    },
    [closeHalndler]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      clearTimeout(timeRef.current);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onKeyDown]);

  const onContentHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Portal >
      <div className={classNames(cls.Modal, mods, [className])}>
        <div className={cls.overlay} onClick={closeHalndler}>
          <div className={cls.content} onClick={onContentHandler}>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};
