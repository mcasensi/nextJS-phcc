import { NextResponse } from 'next/server'

import { NavLinkType } from '@/app/types/navlink'
import { ProjectType } from '@/app/types/project'
import { RecordType } from '@/app/types/record'
import { ReviewType } from '@/app/types/review'
import { SpecializeType } from '@/app/types/specialize'
import { PlanType } from '@/app/types/plan'
import { CategoryType } from '@/app/types/category'
import { FooterLinkType } from '@/app/types/footerlinks'
import { HeroType } from '@/app/types/hero'

const HeroData: HeroType[] = [
  {
    imgSrc: '/images/banner/blogforgeCover.webp',
  },
  {
    imgSrc: '/images/banner/gleamerCover.webp',
  },
  {
    imgSrc: '/images/banner/learnaxisCover.webp',
  },
  {
    imgSrc: '/images/banner/studiovaCover.webp',
  },
]

const NavLinkData: NavLinkType[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About Us',
    href: '/about-us',
  },
  {
    label: 'Events',
    href: '/events',
  },
  {
    label: 'Ministries',
    href: '',
    submenu: [
      {
        label: 'Praise & Worship',
        href: '/chords',
      },
      {
        label: 'Sunday School',
        href: '/sunday-school',
      },
      {
        label: 'one80JAM',
        href: '/one80jam',
      }
    ],
  }
]

const ProjectData: ProjectType[] = [
  {
    coverImg: '/images/project/blogforge.webp',
    name: 'Blog Forge',
  },
  {
    coverImg: '/images/project/gleamer.webp',
    name: 'Gleamer',
  },
  {
    coverImg: '/images/project/learnaxis.webp',
    name: 'Learnaxis',
  },
  {
    coverImg: '/images/project/studiova.webp',
    name: 'Studiova',
  },
  {
    coverImg: '/images/project/homely.webp',
    name: 'Homely',
  },
  {
    coverImg: '/images/project/awake.webp',
    name: 'Awake',
  },
  {
    coverImg: '/images/project/endeavor.webp',
    name: 'Endeavor',
  },
]

const RecordData: RecordType[] = [
  {
    imgSrc: '/images/records/star.svg',
    name: 'Ptr. Alberto & Sis. Susan Desepida',
    desc: 'Head Pastor',
  },
  {
    imgSrc: '/images/records/user.svg',
    name: 'Ptr. Joemari & Sis. Judy Annie Asensi',
    desc: 'Assistant Pastor',
  },
  {
    imgSrc: '/images/records/user.svg',
    name: 'Ptr. Ernie & Sis. Ning Guda',
    desc: 'Assistant Pastor',
  },
  {
    imgSrc: '/images/records/cart.svg',
    name: 'Bro. Gilbert & Sis. Lisa Hernandez',
    desc: 'Council',
  },
  {
    imgSrc: '/images/records/star.svg',
    name: 'Bro. Jaime & Sis. Lydia Luceno',
    desc: 'Council',
  },
];


const ReviewData: ReviewType[] = [
  {
    imgSrc: '/images/review/daniel.webp',
    name: 'Daniel Reid',
    rating: 4.2,
    desc: 'Pixelize nailed our website redesign. Clean layout, fast loading, and mobile-friendly. Highly recommended!',
  },
  {
    imgSrc: '/images/review/sophia.webp',
    name: 'Sophia Turner',
    rating: 4.5,
    desc: 'The UI/UX improvements boosted our user engagement and conversions. Truly a professional team!',
  },
  {
    imgSrc: '/images/review/marcus.webp',
    name: 'Marcus Lee',
    rating: 4.8,
    desc: 'They understood our brand vision perfectly and delivered a logo that stands out in our industry.',
  },
]

const SpecializeData: SpecializeType[] = [
  {
    title: 'Evangelism',
    desc: 'The Gospel taken outside the four walls is the absolute foundation of our church, in obedience toMark 16:15 And He said to them, ‘Go into all the world and preach the gospel to every creature… We emphasize personal evangelism, and a large variety of outreaches to share the Gospel.',
  },
  {
    title: 'Conversion',
    desc: 'We witness, testify and preach for a decision. The Gospel has the power to save and transform lives.1 Peter 1:23 having been born again, not of corruptible seed but incorruptible, through the word of God which lives and abides forever… The bulk of our congregation consists of people converted here by the Power of God.',
  },
  {
    title: 'The Local Church',
    desc: 'God has placed everything necessary to accomplish His will in the setting of the local church.Ephesians 1:22-23 …the church. Which is his body, the fullness of him who fills everything in every way.God’s will is accomplished in us and through us as connect and commit ourselves to a local church.',
  },
  {
    title: 'Discipleship',
    desc: 'God intends for calling to Him, and for Him, to be accomplished through being trained and equipped within the setting of a local church. Therefore, the highest calling of a Pastor and congregation is to obey God’s command inMatthew 28:19-20 Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age." Amen.',
  },
  {
    title: 'Church Planting',
    desc: 'The result of disciples being raised up is that they be released into the harvest field.Matthew 9:37-38 Then He said to His disciples, "The harvest truly is plentiful, but the laborers are few. 38 Therefore pray the Lord of the harvest to send out laborers into His harvest." We send couples to plant brand new congregations, with the aim of reproducing our vision in a new area.',
  },
  {
    title: 'World Evangelism',
    desc: 'From the earliest Bible record, God’s vision is worldwide testimony and impact. The gospel message and the vision God has revealed to us is not simply American, but God-inspired; so therefore it works, and is relevant in every nation and culture of the world. Mark 16:15 all the world/every person… Matthew 28:19 all the nations… Our job as believers, and as the local church is to pray, train, invest, send and support workers to go into all the world!',
  },
]

const PlanData: PlanType[] = [
  {
    day: 'sunday',
    type: 'Sunday Morning',
    time: '10:00 AM',
    desc: 'Service starts at 10:00 AM every Sunday.',
    option: [
      'Adult Bible Study Classes starting at 9:00 AM',
      'Sunday School for all ages at 9:00 AM',
    ],
  },
  {
    day: 'sunday',
    type: 'Sunday Evening',
    time: '6:30 PM',
    desc: 'Service starts at 6:30 PM every Sunday.',
    option: [
      'Junior Church for children during service',
    ],
  },
  {
    day: 'wednesday',
    type: 'Wednesday Night',
    time: '7:00 PM',
    desc: 'Service starts at 7:00 PM every Wednesday.',
    option: [
      'Junior Church for children during service',
    ],
  },
]

const CategoryData: CategoryType[] = [
  {
    imgSrc: '/images/category/webdev.webp',
    title: 'Web Design',
  },
  {
    imgSrc: '/images/category/logods.webp',
    title: 'Logo Design',
  },
  {
    imgSrc: '/images/category/mobileapp.webp',
    title: 'Mobile App Development',
  },
  {
    imgSrc: '/images/category/contentwrite.webp',
    title: 'Content Writing',
  },
  {
    imgSrc: '/images/category/digitalmarket.webp',
    title: 'Digital Marketing',
  },
]

const FooterLinkData: FooterLinkType[] = [
  {
    section: 'PIONEERING COUNTRIES',
    links: [
      {
        label: 'Vietname',
        href: '/',
      },
      {
        label: 'Laos',
        href: '/',
      },
      {
        label: 'Thailand',
        href: '/',
      },
      {
        label: 'Japan',
        href: '/',
      },
    ],
  },
  {
    section: 'HELPFUL LINKS',
    links: [
      { label: 'Chords', href: '/chords' },
      { label: 'Sunday School', href: '/sunday-school' },
      { label: 'one80JAM', href: '/one80jam' },
    ],
  },
  {
    section: 'WEBSITES',
    links: [
      { label: "Prescott Potter's House", href: 'https://pottershousephils.com/#:~:text=Prescott%20Potter%27s%20House' },
      { label: 'CFM Map', href: 'https://cfmmap.org/' },
      { label: 'CFM WorldWide', href: 'http://www.worldcfm.com/' },
    ],
  },
]

export const GET = () => {
  return NextResponse.json({
    HeroData,
    NavLinkData,
    ProjectData,
    RecordData,
    ReviewData,
    SpecializeData,
    PlanData,
    CategoryData,
    FooterLinkData,
  })
}
