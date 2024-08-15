import {SetStateAction, useMemo, useState} from "react";
import {SERVER_URL} from "@/app/definitions";
import * as React from "react";
import {GridApi} from '@mui/x-data-grid';

const mock =

export function useLoadDataPopupSearch(setTableData: SetStateAction<any>) {

    const [isLoading, setIsLoading] = useState(false);

    const doLoadDataPopupSearch = useMemo(() => {
        return async (personName: string) => {
            setIsLoading(true);
            //const response = await fetch(`${SERVER_URL}/person/${personName}`)
            //const nodesData = await response.json();

            const nodesData = [{"country": "North Macedonia", "address": "3645 Taylor Corners", "name": "Johnny Mclean", "id": "p123980", "type": "person", "birthDate": "1984-02-06"}, {"country": "Mali", "address": "1762 Michelle Mountains", "name": "Amanda Johnson", "id": "p277830", "type": "person", "birthDate": "2012-08-24"}, {"country": "Estonia", "address": "17807 Spencer Throughway Apt. 882", "name": "Johnny Chambers", "id": "p67972", "type": "person", "birthDate": "1986-12-11"}, {"country": "Seychelles", "address": "4920 Jesse Station", "name": "John Bennett", "id": "p180797", "type": "person", "birthDate": "2007-09-14"}, {"country": "United Kingdom", "address": "180 Bolton Circles", "name": "John Brown", "id": "p362468", "type": "person", "birthDate": "1928-06-04"}, {"country": "Botswana", "address": "10048 Floyd Pine", "name": "John Davis", "id": "p82719", "type": "person", "birthDate": "1964-04-21"}, {"country": "Holy See (Vatican City State)", "address": "97588 Randall Hollow Apt. 970", "name": "John Stewart", "id": "p113786", "type": "person", "birthDate": "1986-05-29"}, {"country": "Guinea-Bissau", "address": "187 Kathleen Shoal Apt. 538", "name": "John Rivera", "id": "p400185", "type": "person", "birthDate": "1925-09-12"}, {"country": "Kuwait", "address": "1299 Bentley Terrace", "name": "John Neal", "id": "p259083", "type": "person", "birthDate": "2004-06-26"}, {"country": "Haiti", "address": "423 Wright Port Apt. 470", "name": "John Fitzgerald", "id": "p191434", "type": "person", "birthDate": "1957-09-02"}, {"country": "Zambia", "address": "403 Clark Mountain Suite 187", "name": "John Ball", "id": "p157929", "type": "person", "birthDate": "2006-06-30"}, {"country": "Central African Republic", "address": "208 Porter Oval Suite 733", "name": "John Hinton", "id": "p221688", "type": "person", "birthDate": "1938-11-03"}, {"country": "New Zealand", "address": "908 Francis Harbors Apt. 439", "name": "John Miller", "id": "p31927", "type": "person", "birthDate": "2007-10-12"}, {"country": "Canada", "address": "248 Walters Lake", "name": "John Washington", "id": "p106792", "type": "person", "birthDate": "1931-07-10"}, {"country": "Bangladesh", "address": "882 Suarez Trail", "name": "John Walker", "id": "p208359", "type": "person", "birthDate": "2016-11-28"}, {"country": "Uruguay", "address": "257 Don Locks Suite 392", "name": "Blake Johnson", "id": "p274549", "type": "person", "birthDate": "1909-06-29"}, {"country": "Mauritania", "address": "0208 Conway Garden Apt. 503", "name": "John Salinas", "id": "p113558", "type": "person", "birthDate": "1939-09-22"}]
            setTableData(nodesData)
            setIsLoading(false);
        };
    }, [setTableData]);

    return {
        isLoading,
        doLoadDataPopupSearch,
    };

}
