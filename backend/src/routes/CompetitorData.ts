import puppeteer, { Page } from 'puppeteer';
import { CompetitorData, RoomType } from '../shared/types';

async function fetchCompetitorData(roomType: RoomType, checkInDate: Date, checkOutDate: Date): Promise<CompetitorData[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const competitorData: CompetitorData[] = [];

  //Here Competitor A: Booking.com
  //     Competitor B: TripAdvisor 
  //     Competitor C: Hotel.com

  try {
    // Fetch data from Competitor A
    const competitorAData = await fetchDataFromCompetitorA(page, roomType, checkInDate, checkOutDate);
    competitorData.push(competitorAData);

    // Fetch data from Competitor B
    const competitorBData = await fetchDataFromCompetitorB(page, roomType, checkInDate, checkOutDate);
    competitorData.push(competitorBData);

    // Fetch data from Competitor C
    const competitorCData = await fetchDataFromCompetitorC(page, roomType, checkInDate, checkOutDate);
    competitorData.push(competitorCData);

    return competitorData;
  } catch (error) {
    console.error('Error fetching competitor data:', error);
    throw error;
  } finally {
    await browser.close();
  }
}
// Fetches competitor data from Competitor A's website.
async function fetchDataFromCompetitorA(page: Page, roomType: RoomType, checkInDate: Date, checkOutDate: Date): Promise<CompetitorData> {
  // Navigate to Competitor A's website and extract the relevant data
  await page.goto(`https://www.booking.com/index.en-gb.html=${checkInDate}&checkout=${checkOutDate}&room_type=${roomType}`);

  const basePrice = await page.$eval('.room-price', (el) => parseFloat(el.textContent || '0'));
  const averageRating = await page.$eval('.hotel-rating', (el) => parseFloat(el.textContent || '0'));
  const location = await page.$eval('.hotel-location', (el) => el.textContent || 'unknown');
  const services = await page.$$eval('.hotel-amenities li', (els) => els.map((el) => el.textContent || ''));

  return {
    _id: '', 
    hotelId: '', 
    roomType,
    checkInDate,
    checkOutDate,
    basePrice,
    averageRating,
    location,
    services,
  };
}

// Fetches competitor data from Competitor B's website.
async function fetchDataFromCompetitorB(page: Page, roomType: RoomType, checkInDate: Date, checkOutDate: Date): Promise<CompetitorData> {
  // Navigate to Competitor B's website and extract the relevant data
  await page.goto(`https://www.tripadvisor.co.uk/Hotels-g186334-Leicester_Leicestershire_England-Hotels.html=${checkInDate}&checkout=${checkOutDate}&room_type=${roomType}`);

  const basePrice = await page.$eval('.room-price', (el) => parseFloat(el.textContent || '0'));
  const averageRating = await page.$eval('.hotel-rating', (el) => parseFloat(el.textContent || '0'));
  const location = await page.$eval('.hotel-location', (el) => el.textContent || 'unknown');
  const services = await page.$$eval('.hotel-amenities li', (els) => els.map((el) => el.textContent || ''));
  //(el: stands for elemenet  in this case,parseFloat is a built-in JavaScript function used to parse a string argument and return a floating point number )

  return {
    _id: '', 
    hotelId: '',
    roomType,
    checkInDate,
    checkOutDate,
    basePrice,
    averageRating,
    location,
    services,
  };
}

async function fetchDataFromCompetitorC(page: Page, roomType: RoomType, checkInDate: Date, checkOutDate: Date): Promise<CompetitorData> {
  // Navigate to Competitor C's website and extract the relevant data
  await page.goto(`https://uk.hotels.com/?locale=en_GB&siteid=300000005&semcid=HCOM-UK.UB.GOOGLE.GT-c-EN.HOTEL&semdtl=a114410409729.b1126078549723.g1kwd-11212341.e1c.m1Cj0KCQjwztOwBhD7ARIsAPDKnkANClZm4aDgSMY0vU17I6OcA4zt2Dt5SaqxlAFo2fRtk00jRVAU25AaAswiEALw_wcB.r1852884eab3682a30602e615db9b9f09276b08274b7f0c941c8af949318049319.c1.j19046182.k1.d1624322500912.h1e.i1.l1.n1.o1.p1.q1.s1.t1.x1.f1.u1.v1.w1&gad_source=1&gclid=Cj0KCQjwztOwBhD7ARIsAPDKnkANClZm4aDgSMY0vU17I6OcA4zt2Dt5SaqxlAFo2fRtk00jRVAU25AaAswiEALw_wcB
                  =${checkInDate}&checkout=${checkOutDate}&room_type=${roomType}`);

  const basePrice = await page.$eval('.room-price', (el) => parseFloat(el.textContent || '0'));
  const averageRating = await page.$eval('.hotel-rating', (el) => parseFloat(el.textContent || '0'));
  const location = await page.$eval('.hotel-location', (el) => el.textContent || 'unknown');
  const services = await page.$$eval('.hotel-amenities li', (els) => els.map((el) => el.textContent || ''));

  return {
    _id: '', 
    hotelId: '',
    roomType,
    checkInDate,
    checkOutDate,
    basePrice,
    averageRating,
    location,
    services,
  };
}

async function getCompetitorData(roomType: RoomType, checkInDate: Date, checkOutDate: Date): Promise<CompetitorData[]> {
  try {
    // Fetch competitor data from multiple competitor websites
    const competitorData = await fetchCompetitorData(roomType, checkInDate, checkOutDate);
    return competitorData;
  } catch (error) {
    console.error('Error fetching competitor data:', error);
    throw error;
  }
}

export default CompetitorData;
