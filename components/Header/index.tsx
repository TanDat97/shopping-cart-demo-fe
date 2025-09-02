"use client";

import styles from "./styles.module.scss";
import React, { FC, useState } from "react";
import { Basket } from "@/services/icons/Basket";
import { Logo } from "@/services/icons/Logo";
import { Hamburger } from "@/services/icons/Hamburger";
import { Close } from "@/services/icons/Close";
import { HeaderNavs } from "./constants";
import Link from "next/link";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <div className={styles.header__inner__logo}>
          <Logo />
          <h1>Shopping Cart</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className={styles.header__inner__nav}>
          <nav className={styles.header__inner__nav__desktop}>
            <ul>
              {HeaderNavs.map((el, _i) => (
                <li key={_i}>
                  <Link href={el.href}>{el.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.header__inner__nav__basket}>
            <Basket />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.header__inner__mobileMenuBtn}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <Close /> : <Hamburger />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${styles.header__mobileMenu} ${isMobileMenuOpen ? styles.header__mobileMenu__open : ''}`}>
        <nav>
          <ul>
            {HeaderNavs.map((el, _i) => (
              <li key={_i}>
                <Link href={el.href} onClick={closeMobileMenu}>
                  {el.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.header__mobileMenu__basket}>
          <Basket />
        </div>
      </div>
    </header>
  );
};

export default Header;
