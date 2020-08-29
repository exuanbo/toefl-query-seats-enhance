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

interface QueryData {
  status: boolean
  testDate: string
  testSeats: {
    [key: string]: SeatDetail[]
  }
  lateRegFee: number
  /**
   * Original data above
   */
  availableSeatsNum?: number
  queryTime?: Date
}

interface SeatDetail {
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

const filterSeats = (data: QueryData) => {
  if (data.status === true) {
    const dataDate = Object.keys(data.testSeats)[0]
    const SeatDetailArr: SeatDetail[] = data.testSeats[dataDate]
    const filteredSeatDetailArr: SeatDetail[] = []
    for (const seat of SeatDetailArr) {
      if (seat.seatStatus) filteredSeatDetailArr.push(seat)
    }

    const availableSeatsNum = filteredSeatDetailArr.length
    if (availableSeatsNum) {
      data.testSeats[dataDate] = filteredSeatDetailArr
      data.availableSeatsNum = availableSeatsNum
      return data
    }
  }
  return null
}

export { QueryData, SeatDetail, filterSeats }
