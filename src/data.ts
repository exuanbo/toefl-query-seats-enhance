import { State } from './State'
import axios from 'axios'

/**
 * @example
 * {
    "status":true,
    "testDate":"2020年12月20日 星期日",
    "testSeats":{
     "09:00|20201220|08:30":[
       {
         "provinceCn":"甘肃",
         "provinceEn":"GANSU",
         "cityCn":"兰州",
         "cityEn":"LANZHOU",
         "centerCode":"STN80013A",
         "centerNameCn":"兰州大学",
         "centerNameEn":"LANZHOU UNIVERSITY",
         "testFee":210000,
         "lateReg":"N",
         "seatStatus":1,
         "seatBookStatus":0,
         "rescheduleDeadline":1608134399000,
         "cancelDeadline":1608134399000,
         "testTime":"09:00",
         "lateRegFlag":"N"
        }
      ]
    },
    "lateRegFee":31000
  }
 */

export interface QueryData {
  status: boolean
  testDate: string
  testSeats: {
    [key: string]: SeatDetail[]
  }
  lateRegFee: number
  availableSeats?: number
}

export interface SeatDetail {
  provinceCn: string
  cityCn: string
  centerCode: string
  centerNameCn: string
  testFee: number
  lateReg: 'N' | 'Y'
  seatStatus: -1 | 1
  seatBookStatus: -1 | 1
  testTime: string
  lateRegFlag: 'N' | 'Y'
}

type filteredData = QueryData | null

export const getData = async ({ get }: State): Promise<filteredData> => {
  const city = get('currentCity')
  const testDay = get('currentDate')
  const { data } = await axios.get<QueryData>('testSeat/queryTestSeats', {
    params: { city: city, testDay: testDay }
  })

  return filterSeats(data)
}

const filterSeats = (data: QueryData): filteredData => {
  if (data.status) {
    const dataDate = Object.keys(data.testSeats)[0]
    const seatDetails = data.testSeats[dataDate]

    const filtered = seatDetails.filter(seatDetail => seatDetail.seatStatus)
    const availableSeats = filtered.length

    if (availableSeats > 0) {
      data.testSeats[dataDate] = filtered
      data.availableSeats = availableSeats
      return data
    }
  }

  return null
}
