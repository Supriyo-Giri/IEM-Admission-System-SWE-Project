import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  authService = inject(AuthService);

  streams = [
    {
      code: 'CSE',
      name: 'Computer Science & Engineering',
      desc: 'Comprehensive foundation in algorithms, systems architecture, distributed computing, and software development.',
      seats: '180 Seats',
      badge: 'Core Track'
    },
    {
      code: 'CSE AI/ML',
      name: 'CSE (Artificial Intelligence & Machine Learning)',
      desc: 'Specialized focus on deep learning, neural networks, natural language processing, and intelligent agent systems.',
      seats: '120 Seats',
      badge: 'Emerging Tech'
    },
    {
      code: 'CSE IOTCSBT',
      name: 'CSE (IoT, Cyber Security & Block Chain Tech)',
      desc: 'Convergence of smart connected devices, cryptographic protocols, decentralized ledgers, and edge computing.',
      seats: '60 Seats',
      badge: 'Industry 4.0'
    },
    {
      code: 'CSE CyberSecurity',
      name: 'CSE (Cyber Security)',
      desc: 'Hands-on offensive and defensive cybersecurity, penetration testing, threat hunting, and digital forensics.',
      seats: '60 Seats',
      badge: 'High Demand'
    }
  ];

  steps = [
    {
      step: '01',
      title: 'Register Profile',
      desc: 'Sign up with your personal email and password to access the online admissions portal.'
    },
    {
      step: '02',
      title: 'Submit Application',
      desc: 'Enter your personal details, academic scores (10th, 12th, WBJEE/JEE), and choose your engineering stream.'
    },
    {
      step: '03',
      title: 'Upload Credentials',
      desc: 'Upload mark sheets, entrance score cards, and identity documents securely to Cloudinary.'
    },
    {
      step: '04',
      title: 'Verification & Approval',
      desc: 'Track the status of your admission in real-time as the admissions office reviews and approves your submission.'
    }
  ];
}

