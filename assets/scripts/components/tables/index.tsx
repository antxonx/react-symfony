import table from '@components/tables/table';
import thead from '@components/tables/thead';
import tbody from '@components/tables/tbody';

export interface ThPropsI {
    name: string;
    key?: string | number;
    sort?: boolean;
    activeOrder?: boolean;
    order?: "ASC" | "DESC";
    onClick?: (name: string) => void;
    [ key: string ]: any;
}

export interface TdPropsI {
    name?: string;
    [ key: string ]: any;
}

export interface TbodyRows {
    cells: TdPropsI[];
    id: string;
    [ key: string ]: any;
}

export const Table = table;
export const Thead = thead;
export const Tbody = tbody;