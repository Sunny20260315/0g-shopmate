import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PreferenceEntity } from './entities/preference.entity';

@Injectable()
export class PreferenceService {
  private readonly logger = new Logger(PreferenceService.name);
  // key = wallet address, value = preferences array
  private store = new Map<string, PreferenceEntity[]>();
  private idCounter = 1;

  findAll(address: string): PreferenceEntity[] {
    return this.store.get(address.toLowerCase()) || [];
  }

  create(address: string, data: { type: string; value: string; category: string }): PreferenceEntity {
    const normalized = address.toLowerCase();
    if (!this.store.has(normalized)) {
      this.store.set(normalized, []);
    }

    const preference: PreferenceEntity = {
      id: this.idCounter++,
      userAddress: normalized,
      type: data.type,
      value: data.value,
      category: data.category,
      hash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      created: new Date().toISOString(),
      monetized: false,
      earnings: 0,
    };

    this.store.get(normalized)!.push(preference);
    this.logger.log(`Preference created for ${normalized}: ${data.type}=${data.value}`);
    return preference;
  }

  update(address: string, id: number, data: { monetized?: boolean; value?: string }): PreferenceEntity {
    const pref = this.findOne(address, id);
    if (data.monetized !== undefined) pref.monetized = data.monetized;
    if (data.value !== undefined) pref.value = data.value;
    return pref;
  }

  remove(address: string, id: number): void {
    const normalized = address.toLowerCase();
    const list = this.store.get(normalized);
    if (!list) throw new NotFoundException('Preference not found');

    const index = list.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException('Preference not found');

    list.splice(index, 1);
    this.logger.log(`Preference ${id} deleted for ${normalized}`);
  }

  private findOne(address: string, id: number): PreferenceEntity {
    const list = this.store.get(address.toLowerCase()) || [];
    const pref = list.find((p) => p.id === id);
    if (!pref) throw new NotFoundException('Preference not found');
    return pref;
  }
}
