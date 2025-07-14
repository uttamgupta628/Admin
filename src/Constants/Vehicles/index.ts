interface VehicleOwner {
  id: number;
  ownerName: string;
  vehicleNo: string;
  vehicleInfo: string;
  address: string;
  ownerContact: string;
  otherInfo?: VehicleOtherInfo;
  isActivated: boolean;
}

interface VehicleOtherInfo {
  SerialNo: string;
  EngineNo: string;
  ChassisNo: string;
  FuelType?: string;
  Transmission?: string;
  RegistrationDate?: string;
  InsuranceExpiry?: string;
  PollutionExpiry?: string;
  FitnessExpiry?: string;
  PermitExpiry?: string;
}

export const allVehicleOwnersList: VehicleOwner[] = [
  {
    id: 1,
    ownerName: 'John Doe',
    vehicleNo: 'CA-1234-XYZ',
    vehicleInfo: '2020 Tesla Model 3',
    address: '1234 Elm Street, Los Angeles, CA, 90001',
    ownerContact: '+1-310-555-1234',
    otherInfo: {
      SerialNo: 'SN123456789',
      EngineNo: 'ENG-TES-987654',
      ChassisNo: 'CHS-TES-456789',
      FuelType: 'Electric',
      Transmission: 'Automatic',
      RegistrationDate: '2020-06-15',
      InsuranceExpiry: '2025-06-15',
      PollutionExpiry: 'N/A',
      FitnessExpiry: '2025-06-15',
      PermitExpiry: '2026-06-15',
    },
    isActivated: true,
  },
  {
    id: 2,
    ownerName: 'Emily Johnson',
    vehicleNo: 'TX-9876-ABC',
    vehicleInfo: '2018 Ford F-150',
    address: '5678 Oak Street, Houston, TX, 77002',
    ownerContact: '+1-832-555-6789',
    otherInfo: {
      SerialNo: 'SN987654321',
      EngineNo: 'ENG-FRD-123456',
      ChassisNo: 'CHS-FRD-654321',
      FuelType: 'Gasoline',
      Transmission: 'Automatic',
      RegistrationDate: '2018-03-10',
      InsuranceExpiry: '2024-03-10',
      PollutionExpiry: '2024-03-10',
      FitnessExpiry: '2026-03-10',
      PermitExpiry: '2027-03-10',
    },
    isActivated: true,
  },
  {
    id: 3,
    ownerName: 'Michael Smith',
    vehicleNo: 'FL-4567-PQR',
    vehicleInfo: '2019 Honda Accord',
    address: '7890 Pine Street, Miami, FL, 33101',
    ownerContact: '+1-305-555-7890',
    otherInfo: {
      SerialNo: 'SN456789123',
      EngineNo: 'ENG-HON-789123',
      ChassisNo: 'CHS-HON-123789',
      FuelType: 'Hybrid',
      Transmission: 'Automatic',
      RegistrationDate: '2019-09-20',
      InsuranceExpiry: '2024-09-20',
      PollutionExpiry: '2024-09-20',
      FitnessExpiry: '2025-09-20',
      PermitExpiry: '2026-09-20',
    },
    isActivated: false,
  },
  {
    id: 4,
    ownerName: 'Sarah Williams',
    vehicleNo: 'NY-6789-DEF',
    vehicleInfo: '2021 Chevrolet Tahoe',
    address: '2468 Maple Ave, New York, NY, 10001',
    ownerContact: '+1-212-555-2468',
    otherInfo: {
      SerialNo: 'SN678912345',
      EngineNo: 'ENG-CHV-456123',
      ChassisNo: 'CHS-CHV-321456',
      FuelType: 'Diesel',
      Transmission: 'Automatic',
      RegistrationDate: '2021-07-30',
      InsuranceExpiry: '2026-07-30',
      PollutionExpiry: '2026-07-30',
      FitnessExpiry: '2027-07-30',
      PermitExpiry: '2028-07-30',
    },
    isActivated: true,
  },
  {
    id: 5,
    ownerName: 'David Brown',
    vehicleNo: 'IL-2345-GHI',
    vehicleInfo: '2017 Toyota Camry',
    address: '1357 Birch St, Chicago, IL, 60601',
    ownerContact: '+1-312-555-1357',
    otherInfo: {
      SerialNo: 'SN234567891',
      EngineNo: 'ENG-TOY-567891',
      ChassisNo: 'CHS-TOY-891567',
      FuelType: 'Gasoline',
      Transmission: 'Automatic',
      RegistrationDate: '2017-05-25',
      InsuranceExpiry: '2023-05-25',
      PollutionExpiry: '2023-05-25',
      FitnessExpiry: '2024-05-25',
      PermitExpiry: '2025-05-25',
    },
    isActivated: false,
  },
  {
    id: 6,
    ownerName: 'Jessica Lee',
    vehicleNo: 'WA-3456-JKL',
    vehicleInfo: '2019 Subaru Outback',
    address: '3690 Cedar St, Seattle, WA, 98101',
    ownerContact: '+1-206-555-3690',
    otherInfo: {
      SerialNo: 'SN345678912',
      EngineNo: 'ENG-SUB-678912',
      ChassisNo: 'CHS-SUB-912678',
      FuelType: 'Gasoline',
      Transmission: 'Automatic',
      RegistrationDate: '2019-11-05',
      InsuranceExpiry: '2024-11-05',
      PollutionExpiry: '2024-11-05',
      FitnessExpiry: '2026-11-05',
      PermitExpiry: '2027-11-05',
    },
    isActivated: true,
  },
  {
    id: 7,
    ownerName: 'Chris Evans',
    vehicleNo: 'CA-4567-MNO',
    vehicleInfo: '2020 Hyundai Sonata',
    address: '2468 Elm St, Los Angeles, CA, 90001',
    ownerContact: '+1-310-555-2468',
    otherInfo: {
      SerialNo: 'SN456789123',
      EngineNo: 'ENG-HYN-789123',
      ChassisNo: 'CHS-HYN-123789',
      FuelType: 'Hybrid',
      Transmission: 'Automatic',
      RegistrationDate: '2020-08-15',
      InsuranceExpiry: '2025-08-15',
      PollutionExpiry: 'N/A',
      FitnessExpiry: '2025-08-15',
      PermitExpiry: '2026-08-15',
    },
    isActivated: false,
  },
  {
    id: 8,
    ownerName: 'Olivia Taylor',
    vehicleNo: 'TX-5678-PQR',
    vehicleInfo: '2018 Jeep Wrangler',
    address: '1357 Oak St, Houston, TX, 77002',
    ownerContact: '+1-832-555-1357',
    otherInfo: {
      SerialNo: 'SN567891234',
      EngineNo: 'ENG-JEE-891234',
      ChassisNo: 'CHS-JEE-234891',
      FuelType: 'Gasoline',
      Transmission: 'Automatic',
      RegistrationDate: '2018-04-20',
      InsuranceExpiry: '2023-04-20',
      PollutionExpiry: '2023-04-20',
      FitnessExpiry: '2025-04-20',
      PermitExpiry: '2026-04-20',
    },
    isActivated: true,
  },
];
