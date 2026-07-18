import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Phone, MapPin, Award, Users } from 'lucide-react';

const TeamPage = () => {
  const { t, lang } = useLanguage();

  const teamMembers = [
    {
      id: 1,
      name: 'श्री छिरिछिरि टण्डन',
      role: { en: 'Coordinator', ne: 'संयोजक', hi: 'संयोजक', zh: '协调员', ta: 'ஒருங்கிணைப்பாளர்' },
      // photo: '/team1.jpg',
      description: { en: 'Leading the temple management and community outreach programs.', ne: 'मन्दिर व्यवस्थापन र समुदायिक कार्यक्रमहरूको नेतृत्व गर्दै।' }
    },
    {
      id: 2,
      name: 'श्री उत्तम प्रसाद पौडेल',
      role: { en: 'Co-Coordinator', ne: 'सह-संयोजक', hi: 'सह-संयोजक', zh: '副协调员', ta: 'இணை ஒருங்கிணைப்பாளர்' },
      // photo: '/team2.jpg',
      description: { en: 'Assisting in coordination and event management.', ne: 'समन्वय र कार्यक्रम व्यवस्थापनमा सहयोग।' }
    },
    {
      id: 3,
      name: 'श्री कृष्णचन्द्र आचार्य',
      role: { en: 'Member', ne: 'सदस्य', hi: 'सदस्य', zh: '成员', ta: 'உறுப்பினர்' },
      // photo: '/team3.jpg',
      description: { en: 'Active member of the temple committee.', ne: 'मन्दिर समितिको सक्रिय सदस्य।' }
    },
    {
      id: 4,
      name: 'श्री दीनबन्धु ढकाल',
      role: { en: 'Member', ne: 'सदस्य', hi: 'सदस्य', zh: '成员', ta: 'உறுப்பினர்' },
      // photo: '/team4.jpg',
      description: { en: 'Active member of the temple committee.', ne: 'मन्दिर समितिको सक्रिय सदस्य।' }
    },
    {
      id: 5,
      name: 'श्री बालानाथ उपाध्याय',
      role: { en: 'Member', ne: 'सदस्य', hi: 'सदस्य', zh: '成员', ta: 'உறுப்பினர்' },
      // photo: '/team5.jpg',
      description: { en: 'Active member of the temple committee.', ne: 'मन्दिर समितिको सक्रिय सदस्य।' }
    },
    {
      id: 6,
      name: 'श्री उपेन्द्र',
      role: { en: 'Joint Treasurer', ne: 'सहकोषाध्यक्ष', hi: 'सहकोषाध्यक्ष', zh: '联合财务', ta: 'இணை கருவூலர்' },
      // photo: '/team6.jpg',
      description: { en: 'Managing temple finances and donations.', ne: 'मन्दिरको वित्तीय व्यवस्थापन र दान व्यवस्थापन।' }
    },
  ];

  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  };

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #faf8f5 0%, #ffffff 50%, #faf8f5 100%)' }}
    >
      {/* Header */}
      <div className="pt-24 pb-8 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light"
          style={{ color: '#7A0000' }}
        >
          {t.teamTitle || 'हाम्रो टिम'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 text-base sm:text-lg text-mute max-w-xl mx-auto leading-relaxed"
        >
          {t.teamSubtitle || 'मन्दिरको व्यवस्थापन र सेवामा समर्पित हाम्रो टिम'}
        </motion.p>
      </div>

      {/* Team Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => {
            const roleText = getLocalizedText(member.role);
            const descText = getLocalizedText(member.description);

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6 text-center">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-vermilion to-maroon-deep text-white flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-lg shadow-vermilion/20">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <User size={40} />
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-serif text-xl font-semibold text-ink">
                    {member.name}
                  </h3>

                  {/* Role */}
                  <div className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-vermilion/10 text-vermilion text-xs font-semibold">
                    <Award size={12} />
                    {roleText}
                  </div>

                  {/* Description */}
                  {descText && (
                    <p className="text-sm text-ink-soft mt-3 leading-relaxed">
                      {descText}
                    </p>
                  )}

                  {/* Divider */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-ink-soft">
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-vermilion" />
                      {t.teamMember || 'सदस्य'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300" />
          </div>
          <p className="text-sm text-ink-soft">
            {t.teamFooter || 'श्री रामचन्द्र मन्दिरको सेवामा समर्पित हाम्रो टिम'}
          </p>
          <p className="text-xs text-ink-soft/60 mt-1">
            {t.teamBlessing || 'जय श्री राम ! 🙏'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPage;
