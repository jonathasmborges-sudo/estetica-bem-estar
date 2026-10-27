import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';

interface ItemCatalogo {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrencyPipe, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  titulo = 'Estética & Bem-Estar';

  servicos: ItemCatalogo[] = [
    {
      id: 1,
      nome: 'Limpeza de Pele Profunda',
      descricao: 'Tratamento facial completo para remoção de impurezas e renovação celular.',
      preco: 150.00,
      imagem: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500',
      categoria: 'Facial'
    },
    {
      id: 2,
      nome: 'Massagem Relaxante',
      descricao: 'Técnica corporal com óleos essenciais para alívio de tensões e estresse.',
      preco: 120.00,
      imagem: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500',
      categoria: 'Corporal'
    },
    {
      id: 3,
      nome: 'Drenagem Linfática',
      descricao: 'Estimula o sistema linfático, reduzindo retenção de líquidos e inchaço.',
      preco: 140.00,
      imagem: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=500',
      categoria: 'Corporal'
    }
  ];

  produtos: ItemCatalogo[] = [
    {
      id: 101,
      nome: 'Sérum Facial Hidratante',
      descricao: 'Fórmula leve rica em ácido hialurônico para nutrição diária da pele.',
      preco: 89.90,
      imagem: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
      categoria: 'Skincare'
    },
    {
      id: 102,
      nome: 'Protetor Solar FPS 50',
      descricao: 'Toque seco com alta proteção UVA/UVB e acabamento aveludado.',
      preco: 75.00,
      imagem: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
      categoria: 'Skincare'
    },
    {
      id: 103,
      nome: 'Óleo Corporal Relaxante',
      descricao: 'Com extratos de lavanda e amêndoas para hidratação profunda pós-banho.',
      preco: 62.50,
      imagem: 'https://images.unsplash.com/photo-1608248597266-c89050df9c15?w=500',
      categoria: 'Corpo'
    }
  ];
}