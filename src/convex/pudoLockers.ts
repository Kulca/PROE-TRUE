export type PudoLockerSeed = {
  locker_id: string;
  name: string;
  address: string;
  province: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  is_active: boolean;
};

export const SOUTH_AFRICA_PUDO_LOCKERS: PudoLockerSeed[] = [
  {
    locker_id: "PUDO-GP-001",
    name: "Sandton City PUDO Locker",
    address: "83 Rivonia Rd, Sandton, Johannesburg, 2196",
    province: "Gauteng",
    coordinates: { lat: -26.1076, lng: 28.0567 },
    is_active: true,
  },
  {
    locker_id: "PUDO-GP-002",
    name: "Pretoria East PUDO Locker",
    address: "Atterbury Rd, Faerie Glen, Pretoria, 0043",
    province: "Gauteng",
    coordinates: { lat: -25.7842, lng: 28.3011 },
    is_active: true,
  },
  {
    locker_id: "PUDO-WC-001",
    name: "V&A Waterfront PUDO Locker",
    address: "19 Dock Rd, Victoria & Alfred Waterfront, Cape Town, 8001",
    province: "Western Cape",
    coordinates: { lat: -33.9031, lng: 18.4188 },
    is_active: true,
  },
  {
    locker_id: "PUDO-WC-002",
    name: "Stellenbosch Central PUDO Locker",
    address: "Bird St, Stellenbosch Central, Stellenbosch, 7600",
    province: "Western Cape",
    coordinates: { lat: -33.9331, lng: 18.8602 },
    is_active: true,
  },
  {
    locker_id: "PUDO-KZN-001",
    name: "Gateway Durban PUDO Locker",
    address: "1 Palm Blvd, Umhlanga Ridge, Durban, 4319",
    province: "KwaZulu-Natal",
    coordinates: { lat: -29.7268, lng: 31.0671 },
    is_active: true,
  },
  {
    locker_id: "PUDO-KZN-002",
    name: "Pietermaritzburg Hub PUDO Locker",
    address: "Church St, Pietermaritzburg, 3201",
    province: "KwaZulu-Natal",
    coordinates: { lat: -29.6006, lng: 30.3794 },
    is_active: true,
  },
  {
    locker_id: "PUDO-EC-001",
    name: "Walmer Park PUDO Locker",
    address: "Main Rd, Walmer, Gqeberha, 6070",
    province: "Eastern Cape",
    coordinates: { lat: -33.9841, lng: 25.598 },
    is_active: true,
  },
  {
    locker_id: "PUDO-EC-002",
    name: "East London Central PUDO Locker",
    address: "Oxford St, East London CBD, East London, 5201",
    province: "Eastern Cape",
    coordinates: { lat: -33.0193, lng: 27.9116 },
    is_active: true,
  },
  {
    locker_id: "PUDO-FS-001",
    name: "Bloemfontein Mimosa PUDO Locker",
    address: "Kelner St, Brandwag, Bloemfontein, 9301",
    province: "Free State",
    coordinates: { lat: -29.1084, lng: 26.216 },
    is_active: true,
  },
  {
    locker_id: "PUDO-FS-002",
    name: "Welkom City Mall PUDO Locker",
    address: "Bok St, Jim Fouchepark, Welkom, 9459",
    province: "Free State",
    coordinates: { lat: -27.9972, lng: 26.7351 },
    is_active: true,
  },
  {
    locker_id: "PUDO-LP-001",
    name: "Polokwane Savannah PUDO Locker",
    address: "Thabo Mbeki St, Bendor, Polokwane, 0699",
    province: "Limpopo",
    coordinates: { lat: -23.9045, lng: 29.4689 },
    is_active: true,
  },
  {
    locker_id: "PUDO-LP-002",
    name: "Tzaneen Lifestyle PUDO Locker",
    address: "Agatha St, Tzaneen, 0850",
    province: "Limpopo",
    coordinates: { lat: -23.8332, lng: 30.1635 },
    is_active: true,
  },
  {
    locker_id: "PUDO-MP-001",
    name: "Nelspruit Crossing PUDO Locker",
    address: "Madiba Dr, Mbombela, 1200",
    province: "Mpumalanga",
    coordinates: { lat: -25.4753, lng: 30.9707 },
    is_active: true,
  },
  {
    locker_id: "PUDO-MP-002",
    name: "Emalahleni Retail PUDO Locker",
    address: "Mandela Dr, eMalahleni, 1035",
    province: "Mpumalanga",
    coordinates: { lat: -25.8732, lng: 29.2236 },
    is_active: true,
  },
  {
    locker_id: "PUDO-NW-001",
    name: "Rustenburg Waterfall PUDO Locker",
    address: "Howick Ave, Cashan, Rustenburg, 0299",
    province: "North West",
    coordinates: { lat: -25.6676, lng: 27.242 },
    is_active: true,
  },
  {
    locker_id: "PUDO-NW-002",
    name: "Potchefstroom Mooirivier PUDO Locker",
    address: "Nelson Mandela Dr, Potchefstroom, 2520",
    province: "North West",
    coordinates: { lat: -26.7168, lng: 27.1013 },
    is_active: true,
  },
  {
    locker_id: "PUDO-NC-001",
    name: "Kimberley Diamond Pavilion PUDO Locker",
    address: "Oliver Rd, Kimberley, 8301",
    province: "Northern Cape",
    coordinates: { lat: -28.7282, lng: 24.7499 },
    is_active: true,
  },
  {
    locker_id: "PUDO-NC-002",
    name: "Upington Kalahari PUDO Locker",
    address: "Schroder St, Upington, 8801",
    province: "Northern Cape",
    coordinates: { lat: -28.4478, lng: 21.2561 },
    is_active: true,
  },
];
