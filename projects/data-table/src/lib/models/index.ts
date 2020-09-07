export enum DataOrderDirection {
    Ascending = 1,
    Descending = 2
}

export interface DataCell {
    view: any;
}

export class DataColumn {
    field: string;
    header?: string;
    sortable: boolean;
    class?: string;
    style?: any;
}

export class DataRow {
    cells: DataCell[];
    object: any;
    rowData: any;
    constructor(rowData: any, object?: any) {
        this.cells = [];
        this.rowData = rowData;
        this.object = object;
        Object.keys(rowData).forEach(key => {
            this.cells[key] = { view: rowData[key] };
        });
    }
}

export class DataLoadEvent {
    page: number;
    count: number;

    order: DataColumn;
    direction: DataOrderDirection;
}
