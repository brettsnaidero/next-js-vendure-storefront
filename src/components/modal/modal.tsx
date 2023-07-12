import { ModalProvider } from '@/components/modal/modal-context';
import React, { PropsWithChildren, useContext } from 'react';
import { Modal as ModalComponent, ConfigProvider, theme } from 'antd';
import { ThemeContext, Theme } from '@/lib/theme-wrapper';
import styles from '@/styles/components/modal.module.css';

type ModalProps = {
  isOpen: boolean;
  close: () => void;
  size?: 'small' | 'medium' | 'large';
};

const Modal: React.FC<PropsWithChildren<ModalProps>> = (
  { isOpen, close, children }, // size = 'medium',
) => {
  const { theme: currentTheme } = useContext(ThemeContext);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          currentTheme === Theme.Light
            ? theme.defaultAlgorithm
            : theme.darkAlgorithm,
      }}
    >
      <ModalComponent
        open={isOpen}
        okButtonProps={{ hidden: true, style: { display: 'none' } }}
        cancelButtonProps={{ hidden: true, style: { display: 'none' } }}
        onCancel={close}
      >
        <ModalProvider close={close}>
          <div className={styles.modal}>{children}</div>
        </ModalProvider>
      </ModalComponent>
    </ConfigProvider>
  );
};

export default Modal;
