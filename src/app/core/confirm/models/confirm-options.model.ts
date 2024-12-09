export interface ConfirmOptions {
    target?: Element;
    message?: string;
    icon?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    acceptIcon?: string;
    rejectIcon?: string;
    acceptVisible?: boolean;
    rejectVisible?: boolean;
    acceptColor?: "accent" | "primary" | "warn" | undefined;
    rejectColor?: "accent" | "primary" | "warn" | undefined;
    //	Callback to execute when item is accept clicked.
    acceptClick?: (...args: any[]) => void;
    //	Callback to execute when item is reject clicked
    rejectClick?: (...args: any[]) => void;

}
