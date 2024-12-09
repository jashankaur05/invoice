import { FilterMetadata, SelectItem } from "primeng/api";


export type TableColumn<T = any> =
   TableColumnBase<T>

/**
 * How the contend of a table cell is aligned.
 */
export enum ColumnAlignment {
    Left = 'LEFT',
    Right = 'RIGHT',
    Center = 'CENTER',
  }

/**
 * column types
 *
 * @default: TEXT
 */
export enum ColumnType {
    Text = 'TEXT',
    Boolean = 'BOOLEAN',
    Color = 'COLOR',
    Icon = 'ICON',
    Image = 'IMAGE',
    DateTime = 'DATE',
    DateAndTime = 'DATETIME',
    Number = 'NUMERIC',
    Resource = 'RESOURCE',
    Select = 'SELECT',
    Tagged ="TAGGED",
    TaggedSelectable ="TAGGED_SELECTABLE"
  }

  export type TTableFilter = Record<string,FilterMetadata | FilterMetadata[]> ;

    export interface TableColumnBase<T = any> {
    /** unique name (id) for table column */
    name: string;

    /** the shown column label. If not set name in uppercase will be used as label */
    label?: string;

    /** show a tooltip if user hovers the colum header */
    headerTooltip?: string;

    /** can the table be sorted by this column. If not set it is sortable */
    sortable?: boolean;

    /**
     * is the node currently shown in the table,
     * the user can change this prop via the 'shown columns' menu.
     * If not set it is true.
     */
    show?: boolean;

    /**
     * define column types for automatic rendering of data depending on type
     *
     * @default: TEXT
     */
    type?: ColumnType;

    /**
     * can the user change the visibility of this column via the 'shown columns' menu.
     * If not set it is true.
     */
    visibilityChangeable?: boolean;

    /**
     * how the contend of a table cell is aligned. @default LEFT.
     */
    alignment?: ColumnAlignment;

    /**
     * Can the table be grouped by this column. @default true.
     */
    groupable?: boolean;

    /** can the column be filtered @default true */
    filterable?: boolean;

    /** data lambda function to select which data are used in column (for showing, filtering, ...)
     *
     * @default undefined (column name will be used to show data: row[name])
     */
    data?: (row: T) => any;

    /**
     * Can show a tooltip on hover. It can parse format like {{column}} if rowData.column exists.
     */
    tooltip?: string | ((row: T) => string | undefined);

    /**
     * determines if a string is automatically truncated after xx chars
     */
    truncate?: number;

    /** the color of the column content - default `currentColor` */
    color?:string

    /**
     * Width of this column, sets value of css width prop. Can be 'XX%' or 'XXpx'.
     * NOTE: Mixing absolute(px) and relative(%) width in one table can cause problems when grouping is enabled.
     *       While grouping the absolute columns could be pushed to the right due to the added indent at the left.
     */
    width?: string;

    /**
     * indicates if a column is hovered
     */
    hover?: boolean;

    //	RouterLink definition for internal navigation.
    routerLink?: (row: T) => string | any[] | null | undefined;

    filterOptions?:SelectItem[]

    taggable?:boolean;
    tagOptions?:any
  }

  export class TableColumnValue<T> implements TableColumnBase<T>{

    public filterOptions!:SelectItem[];

    private _tagOptions!: Record<string, string>;

    public get tagOptions():Record<string, string>{
        return this._tagOptions;
    }

    public set tagOptions(options:Record<string, string>){
        (options) && (this._tagOptions = options);
        (options) &&  (this.filterOptions = Object.keys(options).map((key) => ({label:key,value:key}) ));
    }

    constructor(
        public name:string,
        public label:string,
        public type:ColumnType,
        public filterable:boolean = true,
        public sortable:boolean = false,
        tagOptions:Record<string, string>={},
        public width:string='') {
            this.tagOptions = tagOptions;
    }
}

