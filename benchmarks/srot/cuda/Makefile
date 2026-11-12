CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/srot

$(BIN):
	mkdir -p $(BIN)

$(BIN)/srot: srot.c $(HDRS) | $(BIN)
	$(CC) srot.c -o $(BIN)/srot -lcublas

clean:
	rm -rf $(BIN)
