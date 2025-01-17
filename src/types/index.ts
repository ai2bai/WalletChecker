
export interface TabItemProps {
    onClose: () => void;
  }
  
  export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
  }
  
  export type TabComponent = React.FC<TabItemProps>;