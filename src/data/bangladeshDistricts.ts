export interface DistrictInfo {
  name: string;
  bn: string;
  division: string;
  zone: 'inside_dhaka' | 'outside_dhaka';
  upazilas: string[];
}

export const BANGLADESH_DISTRICTS: DistrictInfo[] = [
  // --- DHAKA DIVISION (13 Districts) ---
  {
    name: 'Dhaka',
    bn: 'ঢাকা',
    division: 'Dhaka',
    zone: 'inside_dhaka',
    upazilas: [
      'Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Mirpur', 'Mohammadpur', 'Motijheel',
      'Badda', 'Khilgaon', 'Tejgaon', 'Rampura', 'Old Dhaka', 'Paltan', 'Savar', 'Keraniganj',
      'Dhamrai', 'Ashulia', 'Jatrabari', 'Basundhara R/A', 'Mohakhali', 'Malibagh', 'Lalbagh',
      'Cantonment', 'Hazaribagh', 'Demra', 'Khilkhet', 'Biman Bandar', 'Kafrul', 'Shahbagh', 'Wari'
    ]
  },
  {
    name: 'Gazipur',
    bn: 'গাজীপুর',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj', 'Board Bazar', 'Konabari']
  },
  {
    name: 'Narayanganj',
    bn: 'নারায়ণগঞ্জ',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Narayanganj Sadar', 'Bandar', 'Rupganj', 'Sonargaon', 'Araihazar', 'Fatullah', 'Siddhirganj']
  },
  {
    name: 'Narsingdi',
    bn: 'নরসিংদী',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura', 'Shibpur']
  },
  {
    name: 'Tangail',
    bn: 'টাঙ্গাইল',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Tangail Sadar', 'Mirzapur', 'Ghatail', 'Madhupur', 'Gopalpur', 'Delduar', 'Kalihati', 'Basail', 'Bhuapur', 'Nagarpur', 'Sakhipur', 'Dhanbari']
  },
  {
    name: 'Manikganj',
    bn: 'মানিকগঞ্জ',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Manikganj Sadar', 'Singair', 'Saturia', 'Shibalaya', 'Ghior', 'Harirampur', 'Daulatpur']
  },
  {
    name: 'Munshiganj',
    bn: 'মুন্সীগঞ্জ',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Munshiganj Sadar', 'Sreenagar', 'Sirajdikhan', 'Lohajang', 'Tongibari', 'Gazaria']
  },
  {
    name: 'Faridpur',
    bn: 'ফরিদপুর',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Faridpur Sadar', 'Boalmari', 'Alfadanga', 'Madhukhali', 'Bhanga', 'Nagarkanda', 'Charbhadrasan', 'Sadarpur', 'Saltha']
  },
  {
    name: 'Madaripur',
    bn: 'মাদারীপুর',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Madaripur Sadar', 'Shibchar', 'Kalkini', 'Rajoir', 'Dasar']
  },
  {
    name: 'Gopalganj',
    bn: 'গোপালগঞ্জ',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara']
  },
  {
    name: 'Rajbari',
    bn: 'রাজবাড়ী',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Rajbari Sadar', 'Goalanda', 'Pangsha', 'Baliakandi', 'Kalukhali']
  },
  {
    name: 'Shariatpur',
    bn: 'শরীয়তপুর',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Shariatpur Sadar', 'Damudya', 'Naria', 'Janjira', 'Bhedarganj', 'Gosairhat']
  },
  {
    name: 'Kishoreganj',
    bn: 'কিশোরগঞ্জ',
    division: 'Dhaka',
    zone: 'outside_dhaka',
    upazilas: ['Kishoreganj Sadar', 'Bhairab', 'Bajitpur', 'Katiadi', 'Kuliarchar', 'Pakundia', 'Karimganj', 'Tarail', 'Hossainpur', 'Itna', 'Mithamain', 'Nikli', 'Ashtagram']
  },

  // --- CHATTOGRAM DIVISION (11 Districts) ---
  {
    name: 'Chattogram',
    bn: 'চট্টগ্রাম',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: [
      'Panchlaish', 'Kotwali', 'Khulshi', 'Agrabad', 'Halishahar', 'Bakalia', 'Pahartali', 'Chandgaon',
      'Bayazid', 'Double Mooring', 'Hathazari', 'Sitakunda', 'Mirsharai', 'Patiya', 'Raozan', 'Rangunia',
      'Boalkhali', 'Anwara', 'Banshkhali', 'Chandanaish', 'Fatikchhari', 'Lohagara', 'Satkania', 'Sandwip', 'Karnafuli'
    ]
  },
  {
    name: "Cox's Bazar",
    bn: 'কক্সবাজার',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: ["Cox's Bazar Sadar", 'Ramu', 'Chakaria', 'Teknaf', 'Ukhia', 'Maheshkhali', 'Pekua', 'Kutubdia', 'Eidgaon']
  },
  {
    name: 'Cumilla',
    bn: 'কুমিল্লা',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: [
      'Cumilla Adarsha Sadar', 'Cumilla Sadar Dakshin', 'Laksam', 'Debidwar', 'Daudkandi', 'Burichang',
      'Chandina', 'Barura', 'Brahmanpara', 'Chauddagram', 'Homna', 'Muradnagar', 'Meghna', 'Monohargonj',
      'Titas', 'Nangalkot', 'Lalmai'
    ]
  },
  {
    name: 'Feni',
    bn: 'ফেনী',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Sonagazi', 'Fulgazi']
  },
  {
    name: 'Brahmanbaria',
    bn: 'ব্রাহ্মণবাড়িয়া',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: ['Brahmanbaria Sadar', 'Ashuganj', 'Nasirnagar', 'Nabinagar', 'Sarail', 'Kasba', 'Akhaura', 'Bancharampur', 'Bijoynagar']
  },
  {
    name: 'Noakhali',
    bn: 'নোয়াখালী',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Senbagh', 'Subarnachar', 'Kabirhat', 'Sonaimuri']
  },
  {
    name: 'Lakshmipur',
    bn: 'লক্ষ্মীপুর',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar']
  },
  {
    name: 'Chandpur',
    bn: 'চাঁদপুর',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti']
  },
  {
    name: 'Bandarban',
    bn: 'বান্দরবান',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: ['Bandarban Sadar', 'Ali Kadam', 'Thanchi', 'Ruma', 'Rowangchhari', 'Lama', 'Naikhongchhari']
  },
  {
    name: 'Rangamati',
    bn: 'রাঙ্গামাটি',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: ['Rangamati Sadar', 'Kaptai', 'Baghaichhari', 'Barkal', 'Belaichhari', 'Juraichhari', 'Langadu', 'Naniarchar', 'Rajasthali', 'Kaukhali']
  },
  {
    name: 'Khagrachhari',
    bn: 'খাগড়াছড়ি',
    division: 'Chattogram',
    zone: 'outside_dhaka',
    upazilas: ['Khagrachhari Sadar', 'Dighinala', 'Panchhari', 'Mahalchhari', 'Matiranga', 'Manikchhari', 'Ramgarh', 'Guimara', 'Lakshmichhari']
  },

  // --- RAJSHAHI DIVISION (8 Districts) ---
  {
    name: 'Rajshahi',
    bn: 'রাজশাহী',
    division: 'Rajshahi',
    zone: 'outside_dhaka',
    upazilas: ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Chandrima', 'Kashiadanga', 'Godagari', 'Tanore', 'Paba', 'Bagmara', 'Charghat', 'Durgapur', 'Puthia', 'Bagha', 'Mohonpur']
  },
  {
    name: 'Bogura',
    bn: 'বগুড়া',
    division: 'Rajshahi',
    zone: 'outside_dhaka',
    upazilas: ['Bogura Sadar', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Gabtali', 'Kahaloo', 'Dhunat', 'Adamdighi', 'Dupchanchia', 'Nandigram', 'Sariakandi', 'Sonatala']
  },
  {
    name: 'Pabna',
    bn: 'পাবনা',
    division: 'Rajshahi',
    zone: 'outside_dhaka',
    upazilas: ['Pabna Sadar', 'Ishwardi', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Santhia', 'Sujanagar']
  },
  {
    name: 'Sirajganj',
    bn: 'সিরাজগঞ্জ',
    division: 'Rajshahi',
    zone: 'outside_dhaka',
    upazilas: ['Sirajganj Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Tarash', 'Ullapara']
  },
  {
    name: 'Naogaon',
    bn: 'নওগাঁ',
    division: 'Rajshahi',
    zone: 'outside_dhaka',
    upazilas: ['Naogaon Sadar', 'Mohadevpur', 'Manda', 'Badalgachhi', 'Patnitala', 'Dhamoirhat', 'Niamatpur', 'Sapahar', 'Porsha', 'Raninagar', 'Atrai']
  },
  {
    name: 'Natore',
    bn: 'নাটোর',
    division: 'Rajshahi',
    zone: 'outside_dhaka',
    upazilas: ['Natore Sadar', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Singra', 'Bagatipara', 'Naldanga']
  },
  {
    name: 'Chapainawabganj',
    bn: 'চাঁপাইনবাবগঞ্জ',
    division: 'Rajshahi',
    zone: 'outside_dhaka',
    upazilas: ['Chapainawabganj Sadar', 'Shibganj', 'Gomostapur', 'Nachole', 'Bholahat']
  },
  {
    name: 'Joypurhat',
    bn: 'জয়পুরহাট',
    division: 'Rajshahi',
    zone: 'outside_dhaka',
    upazilas: ['Joypurhat Sadar', 'Panchbibi', 'Kalai', 'Khetlal', 'Akkelpur']
  },

  // --- KHULNA DIVISION (10 Districts) ---
  {
    name: 'Khulna',
    bn: 'খুলনা',
    division: 'Khulna',
    zone: 'outside_dhaka',
    upazilas: [
      'Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali', 'Dumuria',
      'Rupsha', 'Batiaghata', 'Dacope', 'Phultala', 'Dighalia', 'Koyra', 'Paikgachha', 'Terokhada'
    ]
  },
  {
    name: 'Jessore',
    bn: 'যশোর',
    division: 'Khulna',
    zone: 'outside_dhaka',
    upazilas: ['Jessore Sadar', 'Jhikargachha', 'Sharsha', 'Manirampur', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Keshabpur']
  },
  {
    name: 'Kushtia',
    bn: 'কুষ্টিয়া',
    division: 'Khulna',
    zone: 'outside_dhaka',
    upazilas: ['Kushtia Sadar', 'Kumarkhali', 'Khoksa', 'Mirpur', 'Bheramara', 'Daulatpur']
  },
  {
    name: 'Jhenaidah',
    bn: 'ঝিনাইদহ',
    division: 'Khulna',
    zone: 'outside_dhaka',
    upazilas: ['Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa', 'Harinakunda']
  },
  {
    name: 'Satkhira',
    bn: 'সাতক্ষীরা',
    division: 'Khulna',
    zone: 'outside_dhaka',
    upazilas: ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Shyamnagar', 'Tala']
  },
  {
    name: 'Bagerhat',
    bn: 'বাগেরহাট',
    division: 'Khulna',
    zone: 'outside_dhaka',
    upazilas: ['Bagerhat Sadar', 'Mongla', 'Fakirhat', 'Kachua', 'Mollahat', 'Rampal', 'Morrelganj', 'Sarankhola', 'Chitalmari']
  },
  {
    name: 'Chuadanga',
    bn: 'চুয়াডাঙ্গা',
    division: 'Khulna',
    zone: 'outside_dhaka',
    upazilas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar']
  },
  {
    name: 'Meherpur',
    bn: 'মেহেরপুর',
    division: 'Khulna',
    zone: 'outside_dhaka',
    upazilas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar']
  },
  {
    name: 'Narail',
    bn: 'নড়াইল',
    division: 'Khulna',
    zone: 'outside_dhaka',
    upazilas: ['Narail Sadar', 'Lohagara', 'Kalia']
  },
  {
    name: 'Magura',
    bn: 'মাগুরা',
    division: 'Khulna',
    zone: 'outside_dhaka',
    upazilas: ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur']
  },

  // --- BARISHAL DIVISION (6 Districts) ---
  {
    name: 'Barishal',
    bn: 'বরিশাল',
    division: 'Barishal',
    zone: 'outside_dhaka',
    upazilas: ['Barishal Sadar', 'Bakerganj', 'Babuganj', 'Wazirpur', 'Banaripara', 'Gournadi', 'Agailjhara', 'Mehendiganj', 'Muladi', 'Hizla']
  },
  {
    name: 'Patuakhali',
    bn: 'পটুয়াখালী',
    division: 'Barishal',
    zone: 'outside_dhaka',
    upazilas: ['Patuakhali Sadar', 'Bauphal', 'Galachipa', 'Dashmina', 'Kalapara', 'Mirzaganj', 'Dumki', 'Rangabali']
  },
  {
    name: 'Bhola',
    bn: 'ভোলা',
    division: 'Barishal',
    zone: 'outside_dhaka',
    upazilas: ['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin']
  },
  {
    name: 'Pirojpur',
    bn: 'পিরোজপুর',
    division: 'Barishal',
    zone: 'outside_dhaka',
    upazilas: ['Pirojpur Sadar', 'Bhandaria', 'Mathbaria', 'Kawkhali', 'Nazirpur', 'Nesarabad (Swarupkati)', 'Indurkani']
  },
  {
    name: 'Barguna',
    bn: 'বরগুনা',
    division: 'Barishal',
    zone: 'outside_dhaka',
    upazilas: ['Barguna Sadar', 'Amtali', 'Betagi', 'Bamna', 'Patharghata', 'Taltali']
  },
  {
    name: 'Jhalokati',
    bn: 'ঝালকাঠি',
    division: 'Barishal',
    zone: 'outside_dhaka',
    upazilas: ['Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur']
  },

  // --- SYLHET DIVISION (4 Districts) ---
  {
    name: 'Sylhet',
    bn: 'সিলেট',
    division: 'Sylhet',
    zone: 'outside_dhaka',
    upazilas: [
      'Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Balaganj', 'Biswanath', 'Fenchuganj',
      'Zakiganj', 'Kanaighat', 'Companiganj', 'Gowainghat', 'Jaintiapur', 'Dakshin Surma', 'Osmani Nagar'
    ]
  },
  {
    name: 'Moulvibazar',
    bn: 'মৌলভীবাজার',
    division: 'Sylhet',
    zone: 'outside_dhaka',
    upazilas: ['Moulvibazar Sadar', 'Sreemangal', 'Kamalganj', 'Kulaura', 'Barlekha', 'Juri', 'Rajnagar']
  },
  {
    name: 'Habiganj',
    bn: 'হবিগঞ্জ',
    division: 'Sylhet',
    zone: 'outside_dhaka',
    upazilas: ['Habiganj Sadar', 'Madhabpur', 'Nabiganj', 'Bahubal', 'Chunarughat', 'Baniachong', 'Ajmiriganj', 'Lakhai', 'Shayestaganj']
  },
  {
    name: 'Sunamganj',
    bn: 'সুনামগঞ্জ',
    division: 'Sylhet',
    zone: 'outside_dhaka',
    upazilas: [
      'Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Derai', 'Dharampasha', 'Tahirpur',
      'Bishwamvarpur', 'Jamalganj', 'Shalla', 'Dowarabazar', 'South Sunamganj (Shantiganj)'
    ]
  },

  // --- RANGPUR DIVISION (8 Districts) ---
  {
    name: 'Rangpur',
    bn: 'রংপুর',
    division: 'Rangpur',
    zone: 'outside_dhaka',
    upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj']
  },
  {
    name: 'Kurigram',
    bn: 'কুড়িগ্রাম',
    division: 'Rangpur',
    zone: 'outside_dhaka',
    upazilas: ['Kurigram Sadar', 'Ulipur', 'Nageswari', 'Bhurungamari', 'Chilmari', 'Rowmari', 'Char Rajibpur', 'Phulbari', 'Rajarhat']
  },
  {
    name: 'Dinajpur',
    bn: 'দিনাজপুর',
    division: 'Rangpur',
    zone: 'outside_dhaka',
    upazilas: ['Dinajpur Sadar', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Phulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur']
  },
  {
    name: 'Gaibandha',
    bn: 'গাইবান্ধা',
    division: 'Rangpur',
    zone: 'outside_dhaka',
    upazilas: ['Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj', 'Fulchhari']
  },
  {
    name: 'Nilphamari',
    bn: 'নীলফামারী',
    division: 'Rangpur',
    zone: 'outside_dhaka',
    upazilas: ['Nilphamari Sadar', 'Saidpur', 'Domar', 'Dimla', 'Jaldhaka', 'Kishoreganj']
  },
  {
    name: 'Lalmonirhat',
    bn: 'লালমনিরহাট',
    division: 'Rangpur',
    zone: 'outside_dhaka',
    upazilas: ['Lalmonirhat Sadar', 'Aditmari', 'Kaliganj', 'Hatibandha', 'Patgram']
  },
  {
    name: 'Panchagarh',
    bn: 'পঞ্চগড়',
    division: 'Rangpur',
    zone: 'outside_dhaka',
    upazilas: ['Panchagarh Sadar', 'Boda', 'Debiganj', 'Tetulia', 'Atwari']
  },
  {
    name: 'Thakurgaon',
    bn: 'ঠাকুরগাঁও',
    division: 'Rangpur',
    zone: 'outside_dhaka',
    upazilas: ['Thakurgaon Sadar', 'Pirganj', 'Ranisankail', 'Haripur', 'Baliadangi']
  },

  // --- MYMENSINGH DIVISION (4 Districts) ---
  {
    name: 'Mymensingh',
    bn: 'ময়মনসিংহ',
    division: 'Mymensingh',
    zone: 'outside_dhaka',
    upazilas: ['Mymensingh Sadar', 'Muktagachha', 'Trishal', 'Bhaluka', 'Fulbaria', 'Gafargaon', 'Gouripur', 'Haluaghat', 'Ishwarganj', 'Dhobaura', 'Nandail', 'Phulpur', 'Tara Khanda']
  },
  {
    name: 'Jamalpur',
    bn: 'জামালপুর',
    division: 'Mymensingh',
    zone: 'outside_dhaka',
    upazilas: ['Jamalpur Sadar', 'Baksiganj', 'Dewanganj', 'Islampur', 'Madarganj', 'Melandaha', 'Sarishabari']
  },
  {
    name: 'Netrokona',
    bn: 'নেত্রকোণা',
    division: 'Mymensingh',
    zone: 'outside_dhaka',
    upazilas: ['Netrokona Sadar', 'Barhatta', 'Durgapur', 'Kendua', 'Atpara', 'Kalmakanda', 'Madan', 'Mohanganj', 'Purbadhala', 'Khaliajuri']
  },
  {
    name: 'Sherpur',
    bn: 'শেরপুর',
    division: 'Mymensingh',
    zone: 'outside_dhaka',
    upazilas: ['Sherpur Sadar', 'Nakla', 'Nalitabari', 'Sreebardi', 'Jhenaigati']
  }
];

export function getDistrictByName(name: string): DistrictInfo | undefined {
  return BANGLADESH_DISTRICTS.find(d => d.name.toLowerCase() === name.toLowerCase());
}
