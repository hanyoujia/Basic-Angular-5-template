import { Injectable } from '@angular/core';
const parseString = require('xml2js').parseString;

@Injectable()
export class XML2JsonService {

    constructor() { }

    public parseXML(src: string): string {
        let retVal = '';
        parseString(src, function (err, result) {
            retVal = result;
        });
        return retVal;
    }

}

