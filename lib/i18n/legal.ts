import type { Locale } from "./config"

export type LegalSection = {
  heading: string
  paragraphs?: string[]
  list?: string[]
}

export type LegalDocument = {
  title: string
  updated: string
  sections: LegalSection[]
}

const privacy: Record<Locale, LegalDocument> = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: {date}",
    sections: [
      {
        heading: "1. Introduction",
        paragraphs: [
          "Welcome to AITools.ninja. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.",
        ],
      },
      {
        heading: "2. Information We Collect",
        paragraphs: ["We may collect, use, store and transfer different kinds of personal data about you:"],
        list: [
          "Contact information (email address, name)",
          "Usage data (how you use our website)",
          "Technical data (IP address, browser type and version)",
        ],
      },
      {
        heading: "3. How We Use Your Information",
        paragraphs: ["We use your personal data for the following purposes:"],
        list: [
          "To provide and maintain our service",
          "To notify you about changes to our service",
          "To provide customer support",
          "To gather analysis or valuable information to improve our service",
          "To monitor the usage of our service",
          "To detect, prevent and address technical issues",
        ],
      },
      {
        heading: "4. Data Security",
        paragraphs: [
          "We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.",
        ],
      },
      {
        heading: "5. Your Rights",
        paragraphs: [
          "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:",
        ],
        list: [
          "Request access to your personal data",
          "Request correction of your personal data",
          "Request erasure of your personal data",
          "Object to processing of your personal data",
          "Request restriction of processing your personal data",
          "Request transfer of your personal data",
          "Right to withdraw consent",
        ],
      },
      {
        heading: "6. Contact Us",
        paragraphs: [
          "If you have any questions about this privacy policy or our privacy practices, please contact us at:",
          "Email: aitoolsrequest@gmail.com",
        ],
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : {date}",
    sections: [
      {
        heading: "1. Introduction",
        paragraphs: [
          "Bienvenue sur AITools.ninja. Nous respectons votre vie privée et protégeons vos données personnelles. Cette politique explique comment nous traitons ces données lorsque vous visitez le site, et quels sont vos droits.",
        ],
      },
      {
        heading: "2. Informations que nous collectons",
        paragraphs: ["Nous pouvons collecter, utiliser, conserver et transmettre plusieurs types de données personnelles vous concernant :"],
        list: [
          "Coordonnées (adresse e-mail, nom)",
          "Données d'usage (la façon dont vous utilisez le site)",
          "Données techniques (adresse IP, type et version du navigateur)",
        ],
      },
      {
        heading: "3. Utilisation de vos informations",
        paragraphs: ["Nous utilisons vos données personnelles pour :"],
        list: [
          "Fournir et maintenir le service",
          "Vous informer des changements apportés au service",
          "Assurer le support",
          "Tirer des enseignements utiles pour améliorer le service",
          "Suivre l'usage du service",
          "Détecter, prévenir et corriger les problèmes techniques",
        ],
      },
      {
        heading: "4. Sécurité des données",
        paragraphs: [
          "Nous avons mis en place des mesures destinées à éviter que vos données personnelles soient perdues, utilisées ou consultées sans autorisation, modifiées ou divulguées. L'accès est limité aux employés, mandataires, prestataires et autres tiers qui ont un besoin professionnel de les connaître.",
        ],
      },
      {
        heading: "5. Vos droits",
        paragraphs: [
          "Dans certains cas, la réglementation sur la protection des données vous reconnaît des droits sur vos données personnelles, notamment le droit de :",
        ],
        list: [
          "Demander l'accès à vos données personnelles",
          "Demander la rectification de vos données personnelles",
          "Demander l'effacement de vos données personnelles",
          "Vous opposer au traitement de vos données personnelles",
          "Demander la limitation du traitement",
          "Demander la portabilité de vos données personnelles",
          "Retirer votre consentement",
        ],
      },
      {
        heading: "6. Nous contacter",
        paragraphs: [
          "Pour toute question sur cette politique ou sur nos pratiques, écrivez-nous à :",
          "E-mail : aitoolsrequest@gmail.com",
        ],
      },
    ],
  },
}

const terms: Record<Locale, LegalDocument> = {
  en: {
    title: "Terms of Service",
    updated: "Last updated: {date}",
    sections: [
      {
        heading: "1. Agreement to Terms",
        paragraphs: [
          "By accessing and using AITools.ninja, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
        ],
      },
      {
        heading: "2. Use License",
        paragraphs: [
          "Permission is granted to temporarily access the materials (information or software) on AITools.ninja for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
        ],
        list: [
          "Modify or copy the materials",
          "Use the materials for any commercial purpose",
          "Attempt to decompile or reverse engineer any software contained on the website",
          "Remove any copyright or other proprietary notations from the materials",
          "Transfer the materials to another person or \"mirror\" the materials on any other server",
        ],
      },
      {
        heading: "3. User Content",
        paragraphs: [
          "By submitting content to our website, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through our website. You retain any and all of your rights to any content you submit, post or display on or through the website.",
        ],
      },
      {
        heading: "4. Disclaimer",
        paragraphs: [
          "The materials on AITools.ninja are provided on an 'as is' basis. AITools.ninja makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
        ],
      },
      {
        heading: "5. Limitations",
        paragraphs: [
          "In no event shall AITools.ninja or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AITools.ninja.",
        ],
      },
      {
        heading: "6. Accuracy of Materials",
        paragraphs: [
          "The materials appearing on AITools.ninja could include technical, typographical, or photographic errors. AITools.ninja does not warrant that any of the materials on its website are accurate, complete, or current. AITools.ninja may make changes to the materials contained on its website at any time without notice.",
        ],
      },
      {
        heading: "7. Links",
        paragraphs: [
          "AITools.ninja has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AITools.ninja of the site. Use of any such linked website is at the user's own risk.",
        ],
      },
      {
        heading: "8. Modifications",
        paragraphs: [
          "AITools.ninja may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.",
        ],
      },
      {
        heading: "9. Contact Us",
        paragraphs: [
          "If you have any questions about these Terms of Service, please contact us at:",
          "Email: aitoolsrequest@gmail.com",
        ],
      },
    ],
  },
  fr: {
    title: "Conditions d'utilisation",
    updated: "Dernière mise à jour : {date}",
    sections: [
      {
        heading: "1. Acceptation des conditions",
        paragraphs: [
          "En accédant à AITools.ninja et en l'utilisant, vous acceptez ces conditions d'utilisation ainsi que les lois et règlements applicables. Si vous n'acceptez pas l'une de ces conditions, vous ne devez pas utiliser ce site ni y accéder.",
        ],
      },
      {
        heading: "2. Licence d'utilisation",
        paragraphs: [
          "L'accès aux contenus (informations ou logiciels) d'AITools.ninja est autorisé de façon temporaire, pour une consultation personnelle, non commerciale et transitoire. Il s'agit d'une licence, pas d'un transfert de propriété. À ce titre, vous ne pouvez pas :",
        ],
        list: [
          "Modifier ou copier les contenus",
          "Utiliser les contenus à des fins commerciales",
          "Tenter de décompiler ou de faire de l'ingénierie inverse d'un logiciel présent sur le site",
          "Retirer une mention de droit d'auteur ou une autre mention de propriété",
          "Transférer les contenus à une autre personne ou les « mirroir » sur un autre serveur",
        ],
      },
      {
        heading: "3. Contenus envoyés par les utilisateurs",
        paragraphs: [
          "En soumettant un contenu sur le site, vous nous autorisez à l'utiliser, le modifier, le représenter, l'afficher, le reproduire et le distribuer sur le site et par son intermédiaire. Vous conservez l'ensemble de vos droits sur les contenus que vous soumettez, publiez ou affichez.",
        ],
      },
      {
        heading: "4. Avertissement",
        paragraphs: [
          "Les contenus d'AITools.ninja sont fournis « en l'état ». AITools.ninja n'accorde aucune garantie, expresse ou implicite, et écarte toute autre garantie, y compris, sans s'y limiter, les garanties implicites de qualité marchande, d'adéquation à un usage particulier, ou d'absence d'atteinte à un droit de propriété intellectuelle ou à un autre droit.",
        ],
      },
      {
        heading: "5. Limitation de responsabilité",
        paragraphs: [
          "AITools.ninja et ses fournisseurs ne pourront en aucun cas être tenus responsables d'un dommage (y compris, sans s'y limiter, la perte de données ou de profit, ou une interruption d'activité) résultant de l'usage ou de l'impossibilité d'utiliser les contenus du site.",
        ],
      },
      {
        heading: "6. Exactitude des contenus",
        paragraphs: [
          "Les contenus présents sur AITools.ninja peuvent comporter des erreurs techniques, typographiques ou photographiques. AITools.ninja ne garantit pas que les contenus du site sont exacts, complets ou à jour. AITools.ninja peut modifier ces contenus à tout moment, sans préavis.",
        ],
      },
      {
        heading: "7. Liens",
        paragraphs: [
          "AITools.ninja n'a pas examiné l'ensemble des sites vers lesquels il pointe et n'est pas responsable de leur contenu. La présence d'un lien n'implique pas une approbation du site lié. L'usage d'un site lié se fait aux risques de l'utilisateur.",
        ],
      },
      {
        heading: "8. Modifications",
        paragraphs: [
          "AITools.ninja peut réviser ces conditions à tout moment, sans préavis. En utilisant le site, vous acceptez la version alors en vigueur.",
        ],
      },
      {
        heading: "9. Nous contacter",
        paragraphs: [
          "Pour toute question sur ces conditions d'utilisation, écrivez-nous à :",
          "E-mail : aitoolsrequest@gmail.com",
        ],
      },
    ],
  },
}

const legalNotice: Record<Locale, LegalDocument> = {
  en: {
    title: "Legal notice",
    updated: "Last updated: {date}",
    sections: [
      {
        heading: "Publisher",
        paragraphs: [
          "Website: AITools.ninja",
          "Legal entity: To be completed",
          "Registered office: To be completed",
          "Contact: contact@aitools.ninja",
        ],
      },
      {
        heading: "Publication director",
        paragraphs: ["To be completed"],
      },
      {
        heading: "Hosting provider",
        paragraphs: [
          "Vercel Inc.",
          "440 N Barranca Ave #4133, Covina, CA 91723, United States",
          "https://vercel.com",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "For any question about this site, email contact@aitools.ninja.",
        ],
      },
    ],
  },
  fr: {
    title: "Mentions légales",
    updated: "Dernière mise à jour : {date}",
    sections: [
      {
        heading: "Éditeur du site",
        paragraphs: [
          "Site : AITools.ninja",
          "Raison sociale : À compléter",
          "Siège social : À compléter",
          "Contact : contact@aitools.ninja",
        ],
      },
      {
        heading: "Directeur de la publication",
        paragraphs: ["À compléter"],
      },
      {
        heading: "Hébergeur",
        paragraphs: [
          "Vercel Inc.",
          "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
          "https://vercel.com",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Pour toute question concernant ce site : contact@aitools.ninja.",
        ],
      },
    ],
  },
}

export function privacyDocument(locale: Locale) {
  return privacy[locale]
}

export function termsDocument(locale: Locale) {
  return terms[locale]
}

export function legalNoticeDocument(locale: Locale) {
  return legalNotice[locale]
}
