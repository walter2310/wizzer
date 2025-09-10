import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceException } from 'src/common/errs';
import { DateService } from 'src/common/utils';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { FetchResponseDto } from './dto/fetch-all-response.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
    private readonly dateService: DateService
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<{ msg: string }> {
    try {
      const note = this.noteRepository.create(createNoteDto);
      await this.noteRepository.save(note);

      return { msg: 'Note created' };
    } catch (error) {
      throw new ServiceException('Could not create note', error);
    }
  }

  async findAll(): Promise<{ data: FetchResponseDto[] }> {
    try {
      const notes = await this.noteRepository.find({
        where: { isDeleted: false },
        order: { createdAt: 'DESC' }
      });

      const formattedNotes = notes.map((note) => {
        return {
          id: note.id,
          text: note.text,
          createdAt: this.dateService.convertDateToDDMMYYYYFormat(
            note.createdAt
          )
        };
      });

      return { data: formattedNotes };
    } catch (error) {
      throw new ServiceException('Could not fetch notes', error);
    }
  }

  async findOneById(noteId: string): Promise<{ data: FetchResponseDto }> {
    try {
      const note = await this.noteRepository.findOneBy({
        id: noteId,
        isDeleted: false
      });

      if (!note) {
        throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
      }

      const formattedNote = {
        id: note.id,
        text: note.text,
        createdAt: this.dateService.convertDateToDDMMYYYYFormat(note.createdAt)
      };

      return { data: formattedNote };
    } catch (error) {
      throw new ServiceException('Could not fetch note', error);
    }
  }

  async update(
    noteId: string,
    updateNoteDto: UpdateNoteDto
  ): Promise<{ msg: string }> {
    try {
      await this.findOneById(noteId);
      await this.noteRepository.update(noteId, updateNoteDto);

      return { msg: 'Note updated' };
    } catch (error) {
      throw new ServiceException('Could not update note', error);
    }
  }

  async remove(noteId: string): Promise<{ msg: string }> {
    try {
      await this.findOneById(noteId);
      await this.noteRepository.update(noteId, { isDeleted: true });

      return { msg: 'Note deleted' };
    } catch (error) {
      throw new ServiceException('Could not delete note', error);
    }
  }
}
