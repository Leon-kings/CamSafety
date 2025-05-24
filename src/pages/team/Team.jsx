/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Twitter,
  Facebook,
  LinkedIn,
  Instagram,
  Close,
  Phone,
  Email,
  LocationOn,
  Work,
  Person
} from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton, Chip } from '@mui/material';
import { teamData } from '../../assets/data/data';

export const Team = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (delay) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.5
      }
    })
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMember(null);
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true }}
      className="container-fluid mt-4 rounded-2xl bg-white text-black py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          variants={itemVariants}
          className="text-center mx-auto mb-12 max-w-xl"
        >
          <h5 className="text-blue-600 uppercase tracking-widest mb-4">
            Team Members
          </h5>
          <h1 className="text-3xl md:text-4xl font-bold">
            Our Professional Team Members
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamData.map((member) => (
            <motion.div
              key={member.id}
              custom={member.delay}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => handleMemberClick(member)}
            >
              <div className="relative rounded-t-lg overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 right-0 flex flex-col bg-white p-2 px-2 -mr-6">
                  <a href={member.social?.twitter} target="_blank" rel="noopener noreferrer" className="m-1 p-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <Twitter fontSize="small" />
                  </a>
                  <a href={member.social?.facebook} target="_blank" rel="noopener noreferrer" className="m-1 p-2 text-gray-600 hover:text-blue-700 transition-colors">
                    <Facebook fontSize="small" />
                  </a>
                  <a href={member.social?.linkedin} target="_blank" rel="noopener noreferrer" className="m-1 p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <LinkedIn fontSize="small" />
                  </a>
                  <a href={member.social?.instagram} target="_blank" rel="noopener noreferrer" className="m-1 p-2 text-gray-600 hover:text-pink-600 transition-colors">
                    <Instagram fontSize="small" />
                  </a>
                </div>
              </div>
              <div className="bg-blue-600 text-center rounded-b-lg p-6">
                <h3 className="text-white text-xl font-semibold">{member.name}</h3>
                <p className="text-white mt-2">{member.position}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Member Details Modal */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          {selectedMember && (
            <>
              <DialogTitle className="flex justify-between items-center bg-blue-600 text-white">
                <div className="flex items-center">
                  <Person className="mr-2" />
                  <span>{selectedMember.name}'s Profile</span>
                </div>
                <IconButton onClick={handleCloseModal} className="text-white">
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent className="py-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0 w-full md:w-1/3">
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="rounded-lg w-full h-auto object-cover shadow-md"
                    />
                    <div className="mt-4 flex justify-center space-x-4">
                      {selectedMember.social?.twitter && (
                        <a href={selectedMember.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                          <Twitter fontSize="large" />
                        </a>
                      )}
                      {selectedMember.social?.facebook && (
                        <a href={selectedMember.social.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                          <Facebook fontSize="large" />
                        </a>
                      )}
                      {selectedMember.social?.linkedin && (
                        <a href={selectedMember.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          <LinkedIn fontSize="large" />
                        </a>
                      )}
                      {selectedMember.social?.instagram && (
                        <a href={selectedMember.social.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                          <Instagram fontSize="large" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                        <p className="text-blue-600 text-lg">{selectedMember.position}</p>
                      </div>

                      <div className="flex items-start">
                        <Work className="text-gray-500 mr-3 mt-1" />
                        <div>
                          <h4 className="font-semibold">Department</h4>
                          <p>{selectedMember.department}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Email className="text-gray-500 mr-3 mt-1" />
                        <div>
                          <h4 className="font-semibold">Email</h4>
                          <a href={`mailto:${selectedMember.email}`} className="text-blue-600 hover:underline">
                            {selectedMember.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone className="text-gray-500 mr-3 mt-1" />
                        <div>
                          <h4 className="font-semibold">Phone Numbers</h4>
                          <div className="space-y-2 mt-1">
                            {selectedMember.phoneNumbers?.map((phone, index) => (
                              <div key={index} className="flex items-center">
                                <span className="mr-2">{phone.type}:</span>
                                <a href={`tel:${phone.number}`} className="text-blue-600 hover:underline">
                                  {phone.number}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {selectedMember.location && (
                        <div className="flex items-start">
                          <LocationOn className="text-gray-500 mr-3 mt-1" />
                          <div>
                            <h4 className="font-semibold">Location</h4>
                            <p>{selectedMember.location}</p>
                          </div>
                        </div>
                      )}

                      {selectedMember.skills && (
                        <div>
                          <h4 className="font-semibold mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedMember.skills.map((skill, index) => (
                              <Chip key={index} label={skill} color="primary" variant="outlined" />
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedMember.bio && (
                        <div>
                          <h4 className="font-semibold">About</h4>
                          <p className="text-gray-700 mt-1">{selectedMember.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </>
          )}
        </Dialog>
      </div>
    </motion.div>
  );
};