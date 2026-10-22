export interface DistrictInfo {
  name: string;
  bn: string;
  zone: 'inside_dhaka' | 'outside_dhaka';
  upazilas: string[];
}

export const BANGLADESH_DISTRICTS: DistrictInfo[] = [
  {
    name: 'Dhaka',
    bn: 'ঢাকা',
    zone: 'inside_dhaka',
    upazilas: [
      'Banani', 'Gulshan', 'Dhanmondi', 'Uttara', 'Mirpur', 'Mohammadpur', 'Motijheel',
      'Badda', 'Khilgaon', 'Tejgaon', 'Rampura', 'Old Dhaka', 'Paltan', 'Savar', 'Keraniganj', 'Dhamrai'
    ]
  },
  {
    name: 'Chattogram',
    bn: 'চট্টগ্রাম',
    zone: 'outside_dhaka',
    upazilas: ['Panchlaish', 'Kotwali', 'Khulshi', 'Agrabad', 'Halishahar', 'Bakalia', 'Hathazari', 'Sitakunda', 'Patiya', 'Raozan']
  },
  {
    name: 'Gazipur',
    bn: 'গাজীপুর',
    zone: 'outside_dhaka',
    upazilas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj']
  },
  {
    name: 'Narayanganj',
    bn: 'নারায়ণগঞ্জ',
    zone: 'outside_dhaka',
    upazilas: ['Narayanganj Sadar', 'Bandar', 'Rupganj', 'Sonargaon', 'Araihazar']
  },
  {
    name: 'Sylhet',
    bn: 'সিলেট',
    zone: 'outside_dhaka',
    upazilas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Balaganj', 'Biswanath', 'Fenchuganj', 'Zakiganj']
  },
  {
    name: 'Rajshahi',
    bn: 'রাজশাহী',
    zone: 'outside_dhaka',
    upazilas: ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Godagari', 'Tanore', 'Paba', 'Bagmara']
  },
  {
    name: 'Khulna',
    bn: 'খুলনা',
    zone: 'outside_dhaka',
    upazilas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Dumuria', 'Rupsha', 'Batiaghata']
  },
  {
    name: 'Barishal',
    bn: 'বরিশাল',
    zone: 'outside_dhaka',
    upazilas: ['Barishal Sadar', 'Bakerganj', 'Babuganj', 'Wazirpur', 'Banaripara', 'Gournadi', 'Agailjhara']
  },
  {
    name: 'Rangpur',
    bn: 'রংপুর',
    zone: 'outside_dhaka',
    upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj']
  },
  {
    name: 'Mymensingh',
    bn: 'ময়মনসিংহ',
    zone: 'outside_dhaka',
    upazilas: ['Mymensingh Sadar', 'Muktagachha', 'Trishal', 'Bhaluka', 'Fulbaria', 'Gafargaon', 'Gouripur']
  },
  {
    name: 'Cumilla',
    bn: 'কুমিল্লা',
    zone: 'outside_dhaka',
    upazilas: ['Cumilla Adarsha Sadar', 'Laksam', 'Debidwar', 'Daudkandi', 'Burichang', 'Chandina', 'Barura']
  },
  {
    name: 'Bogura',
    bn: 'বগুড়া',
    zone: 'outside_dhaka',
    upazilas: ['Bogura Sadar', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Gabtali', 'Kahaloo', 'Dhunat']
  },
  {
    name: "Cox's Bazar",
    bn: 'কক্সবাজার',
    zone: 'outside_dhaka',
    upazilas: ["Cox's Bazar Sadar", 'Ramu', 'Chakaria', 'Teknaf', 'Ukhia', 'Maheshkhali', 'Pekua']
  },
  {
    name: 'Jessore',
    bn: 'যশোর',
    zone: 'outside_dhaka',
    upazilas: ['Jessore Sadar', 'Jhikargachha', 'Sharsha', 'Manirampur', 'Abhaynagar', 'Bagherpara']
  },
  {
    name: 'Tangail',
    bn: 'টাঙ্গাইল',
    zone: 'outside_dhaka',
    upazilas: ['Tangail Sadar', 'Mirzapur', 'Ghatail', 'Madhupur', 'Gopalpur', 'Delduar', 'Kalihati']
  },
  {
    name: 'Feni',
    bn: 'ফেনী',
    zone: 'outside_dhaka',
    upazilas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Sonagazi', 'Fulgazi']
  }
];
