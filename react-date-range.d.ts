declare module 'react-date-range' {
    import * as React from 'react';

    export interface Range {
        startDate?: Date;
        endDate?: Date;
        key?: string;
    }

    export interface RangeKeyDict {
        selection: Range;
        [key: string]: Range | undefined;
    }

    export interface DateRangeProps {
        ranges?: Range[];
        onChange?: (value: RangeKeyDict) => void;
        value?: Range;
        [key: string]: any;
    }

    export const DateRange: React.FC<DateRangeProps>;
}

