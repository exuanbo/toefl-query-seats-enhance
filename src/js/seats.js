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

const filterSeats = data => {
  if (data.status === true) {
    const dataDate = Object.keys(data.testSeats)[0]
    const SeatsArr = data.testSeats[dataDate]
    const filteredSeatsArr = []
    for (const seat of SeatsArr) {
      if (seat.seatStatus) filteredSeatsArr.push(seat)
    }

    const availableSeatsNum = filteredSeatsArr.length
    if (availableSeatsNum) {
      data.testSeats[dataDate] = filteredSeatsArr
      data.availableSeatsNum = availableSeatsNum
      return data
    }
  }
  return null
}

export { filterSeats }
