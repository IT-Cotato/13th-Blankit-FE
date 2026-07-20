interface TopBarSpacerProps {
    heightPx: number;
}

export const TopBarSpacer = ({ heightPx }: TopBarSpacerProps) => {
    return <div className="flex w-full" style={{ height: `${heightPx}px` }} />;
};
