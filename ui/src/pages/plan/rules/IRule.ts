// When creating and updating rules
export interface IApiRuleMutate {
    name: string;
    rrule: string;
    value: number;
    labels?: { [label: string]: any };

}

// Extra server-assigned fields which
export interface IApiRule extends IApiRuleMutate {
    id: string;
    userid: string;
    version: string;
}
